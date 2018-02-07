server
======

Instructions for running
------------------------

Requirements:

 - Python3 (tested using Python 3.6)

Execute in a terminal:

```bash
./update_requirements
./manage.py migrate
```

To run the server:

```bash
./manage.py runserver
```

Navigate to `localhost:800`.

Modifying data
--------------

Create a new user account:

```bash
./manage.py createsuperuser
```

Start the web server as above, and go to `localhost:800/admin`. Log in and you will be presented with an interface for adding / removing database items.
