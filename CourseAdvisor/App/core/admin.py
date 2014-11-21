from django.contrib import admin
from .models import Question


class QuestionAdmin(admin.ModelAdmin):
    fields = ('question', 'occurrences')
    list_display = ('question', 'occurrences')

admin.site.register(Question, QuestionAdmin)
