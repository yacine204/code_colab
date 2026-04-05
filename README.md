# CoLabCode

A collaborative coding platform with GitHub integration.

---


https://github.com/user-attachments/assets/8b74eb61-7ab3-4a6f-abfe-7e7159ccc868


## What it does

- **GitHub OAuth** — connect your GitHub account
- **Workspace management** — create, join, and leave workspaces
- **Repo browser** — browse branches and files from any linked GitHub repo
- **Monaco editor** — open and edit files directly in the browser
- **Commit & PR** — push changes and open a pull request without leaving the app

---

## Stack

**Frontend** — React, TypeScript, Tailwind, Monaco Editor  
**Backend** — Django, Django REST Framework, SimpleJWT 
**Auth** — GitHub OAuth + JWT (djoser)

---

## Getting started

```bash
# backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# frontend
cd frontend
npm install
npm run dev
```


## TODO

- [ ] Real-time collaborative editing (WebSockets / CRDTs)
- [ ] In-workspace chat
- [ ] Member invite system
- [ ] Workspace activity feed
