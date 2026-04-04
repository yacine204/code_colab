from django.urls import path

from .views import WorkspaceMemberView
urlpatterns = [
    path('', WorkspaceMemberView.as_view()),
    path('<int:workspace_id>/', WorkspaceMemberView.as_view())
]