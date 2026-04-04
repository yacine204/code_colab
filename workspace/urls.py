from django.urls import path

from .views import WorkspaceViews

urlpatterns = [
    path('', WorkspaceViews.as_view()),
    path('<int:workspace_id>/', WorkspaceViews.as_view())
]