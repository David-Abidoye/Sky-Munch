from flask import render_template, request, redirect, url_for, session, jsonify

from application import app
from application.restaurant_data import restaurants

from random import randint
import html

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

def sanitize_input(input):
    if type(input) == str:
        return html.escape(input)
    return input

@app.route('/processing', methods=['GET', 'POST'])
def processing():
    if request.method != 'POST':
        return redirect('/')
    
    if session['CSRFToken'] != request.form.get('CSRFToken'):
        session.clear()
        return redirect('/error')

    session['email'] = sanitize_input(request.form.get('email'))
    session['first_name'] = sanitize_input(request.form.get('first_name'))
    session['last_name'] = sanitize_input(request.form.get('last_name'))
    session['phone_no'] = sanitize_input(request.form.get('phone_no'))
    session['building_name'] = sanitize_input(request.form.get('building_name'))
    session['floor'] = sanitize_input(request.form.get('floor'))
    session['office_area'] = sanitize_input(request.form.get('office_area'))
    session['additional_info'] = sanitize_input(request.form.get('additional_info'))
    return redirect(url_for('delivery'))

@app.route('/delivery')
def delivery():
    return render_template('delivery.html', data=session, title='Check on Delivery', css='main')

# Error handling routes
@app.errorhandler(404)
def page_not_found(e):
    return ErrorPage(e.code)

@app.errorhandler(500)
def internal_server_error(e):
    return ErrorPage(e.code)

def ErrorPage(error):
    return render_template('error.html', title='Oopsie...', css='main', error_type=error), error


@app.route('/search_suggestions', methods=['GET'])
def search_suggestions():
    query = request.args.get('query', '').lower()
    # Filter restaurants whose names contain the search query
    suggestions = [r for r in restaurants if query in r['name'].lower()]
    return jsonify(suggestions)

