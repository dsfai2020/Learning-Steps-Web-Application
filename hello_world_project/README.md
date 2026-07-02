Creating a Basic Django Project

Install Django using pip: pip install django

Create a new directory for your project and navigate into it: mkdir hello_world_project && cd hello_world_project

Run django-admin startproject to create a new Django project: python -m django admin startproject hello_world_project

Create a new app within the project: python manage.py startapp hello_world_app

Open settings.py and add 'hello_world_app' to the INSTALLED_APPS list.

INSTALLED_APPS = [
    # ...
    'hello_world_app',
]
Create a new view function in views.py: from django.http import HttpResponse; def hello_world(request): return HttpResponse("Hello, World!")

Create a new URL pattern in urls.py: from django.urls import path; from . import views; urlpatterns = [path('', views.hello_world),]

Create a new HTML template: h1>Hello, World!</h1>

Open urls.py and add the following code to include the app's URLs:

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('hello_world_app.urls')),
]
Run python manage.py runserver to start the Django development server.
That's it! You should now see a simple "Hello, World!" page in your web browser when you navigate to http://localhost:8000/.

Note: Make sure to save each file as its corresponding extension (.py, .html, etc.) and make any necessary changes before proceeding.