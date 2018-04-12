server
======

Instructions for running
------------------------

Requirements:

 - Python 3.6+ (tested using Python 3.6.4)

Execute in a terminal:

```bash
./update_requirements
./manage.py migrate
```

You will then need the game compiled in WebGL mode. Either compile it, saving as `nodev` and copying the `Build` directory into the `game` folder, or request a zipped build on slack and unpack it in the `game` folder.

Optional: If you want some starter data, get a dump from @matsjoyce and then do:

```bash
cat dump.sql | sqlite3 db.sqlite
```

To run the server:

```bash
./manage.py runserver
```

Navigate to `localhost:8000`.

Using the External Database
---------------------------

Note: The external database is _very_ slow, so it is preferable to use the local one.

Run the server using:

```bash
EXT_DB="<key>" ./manage.py runserver
```

where `<key>` is a password you must request from @matsjoyce. **_Do not share the key or commit it to any repo!_**

Modifying data
--------------

Create a new user account:

```bash
./manage.py createsuperuser
```

Start the web server as above, and go to `localhost:8000/admin`. Log in and you will be presented with an interface for adding / removing database items.
