import json
import os
from django import http
from django.core.cache import cache
from django.views.generic import TemplateView, View
import requests
import simplejson

from CourseAdvisor.settings import WASTON_URL


class JSONResponseMixin(object):

    def render_to_response(self, context):
        return self.get_json_response(self.convert_context_to_json(context))

    def get_json_response(self, content, **httpresponse_kwargs):
        return http.HttpResponse(
            content,
            content_type='application/json',
            **httpresponse_kwargs
        )

    def convert_context_to_json(self, context):
        return json.dumps(context)


class IndexView(TemplateView):
    template_name = 'index.html'


class QueryView(JSONResponseMixin, View):
    http_method_names = [u'post', ]

    def post(self, request, *args, **kwargs):
        question = request.POST.get('question')
        if cache.get(question, False):
            return self.render_to_response(cache.get(question))

        headers = {'X-SyncTimeout': 30,
                   'Authorization': 'Basic ' + os.environ['WASTON_KEY'],
                   'Content-Type': 'application/json',
                   'Accept': 'application/json'
                   }
        data = {'question': {'questionText': question}}
        try:
            r = requests.post(WASTON_URL,
                              data=simplejson.dumps(data),
                              headers=headers,
                              timeout=5,
                              )
        except requests.exceptions.ReadTimeout:
            context = {'success': False}
            return self.render_to_response(context)

        if self.request.session.get('question_history', False):
            self.request.session['question_history'] += '##%s' % question
        else:
            self.request.session['question_history'] = question

        print self.request.session['question_history']
        response = simplejson.loads(r.text)
        evidencelist = response['question']['evidencelist']
        tmp = []
        last = ''
        for evidence in evidencelist:
            if evidence['title'] != last:
                tmp.append(evidence)
            last = evidence['title']
        evidencelist = tmp
        context = {}
        context['question'] = {}
        context['question']['evidencelist'] = evidencelist
        context['success'] = True
        context['history'] = self.request.session['question_history']
        cache.set(question, context)
        return self.render_to_response(context)
