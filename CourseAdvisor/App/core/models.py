from django.db import models


class Question(models.Model):
    question = models.CharField(max_length=150)
    occurrences = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.question
