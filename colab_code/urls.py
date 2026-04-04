from django.contrib import admin
from django.urls import include, path, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('workspace/', include('workspace.urls')),
    path('workspace-member/', include('workspace_member.urls')),

    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
]
