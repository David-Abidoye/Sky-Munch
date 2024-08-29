from flask import render_template

from application import app


@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html', title='Sky Munch!')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/menu')
def menu():
    return render_template('menu.html', title='Check the Menu')

# Error handling routes
@app.errorhandler(404)
def page_not_found(e):
    error = 404
    return ErrorPage(error)

@app.errorhandler(500)
def internal_server_error(e):
    error = 500
    return ErrorPage(error)

def ErrorPage(error):
    return render_template('error.html', title='Oopsie...', error_type=error), error
