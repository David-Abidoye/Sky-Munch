from flask import render_template, request, redirect, url_for, session

from application import app

from random import randint

app.secret_key = 'SkyMunch' # Replaced with a key that is stored external to codebase.

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html', title='Sky Munch!', css='main')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/menu')
def menu():
    return render_template('menu.html', title='Check the Menu', css='main')


@app.route('/checkout')
def checkout():
    session['CSRFToken'] = str(randint(1<<15, (1<<16)-1))
    return render_template('checkout.html', title='Complete Your Purchase', css='checkout', CSRFToken=session['CSRFToken'])

@app.route('/processing', methods=['GET', 'POST'])
def processing():
    if request.method != 'POST':
        return redirect('/')
    
    if session['CSRFToken'] != request.form.get('CSRFToken'):
        clear_session()
        return redirect('/error')

    session['email'] = request.form.get('email')
    session['first_name'] = request.form.get('first_name')
    session['last_name'] = request.form.get('last_name')
    session['phone_no'] = request.form.get('phone_no')
    session['building_name'] = request.form.get('building_name')
    session['floor'] = request.form.get('floor')
    session['office_area'] = request.form.get('office_area')
    session['additional_info'] = request.form.get('additional_info')
    return redirect(url_for('form_data_display'))

def clear_session():
    session['email'] = 'email'
    session['first_name'] = 'first_name'
    session['last_name'] = 'last_name'
    session['phone_no'] = 'phone_no'
    session['building_name'] = 'building_name'
    session['floor'] = 'floor'
    session['office_area'] = 'office_area'
    session['additional_info'] = 'additional_info'

@app.route('/form_data_display')
def form_data_display():
    return render_template('form_data_display.html', data=session, title='Test', css='main')

# Error handling routes
@app.errorhandler(404)
def page_not_found(e):
    return ErrorPage(e.code)

@app.errorhandler(500)
def internal_server_error(e):
    return ErrorPage(e.code)

def ErrorPage(error):
    return render_template('error.html', title='Oopsie...', css='main', error_type=error), error
