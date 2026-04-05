import requests
import base64
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from .models import UserGithubToken
import time

User = get_user_model()


@api_view(["GET"])
@permission_classes([AllowAny])
def github_login(request):
    state = request.GET.get("state", "")
    github_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&scope=repo,read:user"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&state={state}"
    )
    return redirect(github_url)


@api_view(["GET"])
@permission_classes([AllowAny])
def github_callback(request):
    code  = request.GET.get("code")
    state = request.GET.get("state")

    if not code or not state:
        return redirect("http://localhost:5173/profile?github=error")

    try:
        decoded = AccessToken(state)
        user = User.objects.get(id=decoded["user_id"])
    except (TokenError, User.DoesNotExist):
        return redirect("http://localhost:5173/profile?github=error")

    res = requests.post(
        "https://github.com/login/oauth/access_token",
        json={
            "client_id":     settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code":          code,
            "redirect_uri":  settings.GITHUB_REDIRECT_URI,
        },
        headers={"Accept": "application/json"}
    )
    access_token = res.json().get("access_token")

    if not access_token:
        return redirect("http://localhost:5173/profile?github=error")

    github_user = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    UserGithubToken.objects.update_or_create(
        user=user,
        defaults={
            "access_token":    access_token,
            "github_username": github_user["login"]
        }
    )

    return redirect("http://localhost:5173/profile?github=success")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def commit_file(request):
    # get user github token
    try:
        token_obj = UserGithubToken.objects.get(user=request.user)
    except UserGithubToken.DoesNotExist:
        return Response({"error": "GitHub not connected"}, status=400)

    gh_token  = token_obj.access_token
    gh_user   = token_obj.github_username
    headers   = {
        "Authorization": f"Bearer {gh_token}",
        "Accept":        "application/vnd.github+json"
    }

    # parse request body 
    repo_url = request.data.get("repo_url")       
    file_path = request.data.get("file_path")      
    file_sha = request.data.get("file_sha")       
    content = request.data.get("content")        
    message = request.data.get("message")        
    branch = request.data.get("branch")         

    if not all([repo_url, file_path, file_sha, content, message, branch]):
        return Response({"error": "Missing required fields"}, status=400)

    # extract owner and repo from url
    parts      = repo_url.rstrip("/").split("/")
    owner      = parts[-2]
    repo       = parts[-1]
    fork_name  = f"{gh_user}/{repo}"

    # fork the repo if not already forked 
    fork_check = requests.get(
        f"https://api.github.com/repos/{fork_name}",
        headers=headers
    )

    if fork_check.status_code == 404:
        
        fork_res = requests.post(
            f"https://api.github.com/repos/{owner}/{repo}/forks",
            headers=headers
        )
        if fork_res.status_code not in [202, 200]:
            return Response({"error": "Failed to fork repo"}, status=500)

        
        time.sleep(3)

    # get default branch SHA to create our branch from 
    fork_info = requests.get(
        f"https://api.github.com/repos/{fork_name}",
        headers=headers
    ).json()
    default_branch = fork_info.get("default_branch", "main")

    ref_res = requests.get(
        f"https://api.github.com/repos/{fork_name}/git/ref/heads/{default_branch}",
        headers=headers
    ).json()
    base_sha = ref_res["object"]["sha"]

    # create branch if it doesnt exist
    branch_check = requests.get(
        f"https://api.github.com/repos/{fork_name}/git/ref/heads/{branch}",
        headers=headers
    )

    if branch_check.status_code == 404:
        create_branch = requests.post(
            f"https://api.github.com/repos/{fork_name}/git/refs",
            headers=headers,
            json={
                "ref": f"refs/heads/{branch}",
                "sha": base_sha
            }
        )
        if create_branch.status_code not in [200, 201]:
            return Response({"error": "Failed to create branch"}, status=500)

    # get file sha on the fork branch 
    file_res = requests.get(
        f"https://api.github.com/repos/{fork_name}/contents/{file_path}",
        headers=headers,
        params={"ref": branch}
    )
    fork_file_sha = file_res.json().get("sha", file_sha)

    # push the file change
    encoded_content = base64.b64encode(content.encode()).decode()

    push_res = requests.put(
        f"https://api.github.com/repos/{fork_name}/contents/{file_path}",
        headers=headers,
        json={
            "message": message,
            "content": encoded_content,
            "sha":     fork_file_sha,
            "branch":  branch
        }
    )

    if push_res.status_code not in [200, 201]:
        return Response({"error": "Failed to push file"}, status=500)

    # open PR to original repo 
    pr_res = requests.post(
        f"https://api.github.com/repos/{owner}/{repo}/pulls",
        headers=headers,
        json={
            "title": f"Changes from workspace: {branch}",
            "head":  f"{gh_user}:{branch}",
            "base":  default_branch,
            "body":  f"Submitted via CoLabCode workspace `{branch}`"
        }
    )

    # 422 means PR already exists — not an error
    if pr_res.status_code not in [200, 201, 422]:
        return Response({"error": "Failed to open PR"}, status=500)

    pr_url = pr_res.json().get("html_url") or \
             pr_res.json().get("errors", [{}])[0].get("message", "PR already exists")

    return Response({
        "success":  True,
        "pr_url":   pr_url,
        "branch":   branch,
        "fork":     fork_name
    })