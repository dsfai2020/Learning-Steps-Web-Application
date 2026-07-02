# Lesson Platform (Django)

This project is configured to run locally and deploy on Render.

## Local run

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run migrations:

```bash
python manage.py migrate
```

4. Start server:

```bash
python manage.py runserver
```

## Render deployment

This repo includes `render.yaml` at the repository root and deployment-ready Django settings.

### Option A: Blueprint deploy (recommended)

1. Push the repo to GitHub.
2. In Render, create a new Blueprint and select this repo.
3. Render will read `render.yaml` and create the web service using:
   - Build command: `pip install -r requirements.txt && python manage.py collectstatic --no-input`
   - Start command: `python manage.py migrate && gunicorn hello_world_project.wsgi:application`

### Option B: Manual Web Service setup

Use these values in Render:

- Root Directory: `hello_world_project`
- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --no-input`
- Start Command: `python manage.py migrate && gunicorn hello_world_project.wsgi:application`

Set environment variables:

- `SECRET_KEY` (required)
- `DEBUG=False`
- `ALLOWED_HOSTS=.onrender.com`
- Optional if using external database: `DATABASE_URL`

## Notes

- Static files are served in production with WhiteNoise.
- If `DATABASE_URL` is not set, the app falls back to SQLite.
- For production, use a managed PostgreSQL database on Render and set `DATABASE_URL`.