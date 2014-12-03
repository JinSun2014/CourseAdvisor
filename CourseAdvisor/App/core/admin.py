from django.contrib import admin
from .models import Question


class QuestionAdmin(admin.ModelAdmin):
    fields = ('question', 'occurrences', )
    list_display = ('question', 'occurrences', 'created_at', )

admin.site.register(Question, QuestionAdmin)
