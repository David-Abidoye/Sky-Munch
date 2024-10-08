from flask import render_template, request, redirect, url_for, session, jsonify, session
from firebase_admin import auth, credentials, initialize_app

from application import app
from application.restaurant_data import restaurants

from random import randint
import html

app.secret_key = 'SkyMunch' # Replaced with a key that is stored external to codebase.

#initialise Firebase Admin SDK
cred = credentials.Certificate('./firebase-adminsdk.json')
initialize_app(cred)


@app.route('/')
@app.route('/home')
def home():
    if session:
        print("Session data at /home route:")
        for key, value in session.items():
            print(f"  {key}: {value}")
    else:
        print("Session is empty at /home route")

    if not session.get('remember'):
        session.clear()
    return render_template('index.html', title='Sky Munch!', css='main')

@app.route('/search_suggestions', methods=['GET'])
def search_suggestions():
    query = request.args.get('query', '').lower()
    # Filter restaurants whose names contain the search query
    suggestions = [r for r in restaurants if query in r['name'].lower()]
    return jsonify(suggestions)

@app.route('/verify-token', methods=['POST'])
def verify_token():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    id_token = data.get('idToken')
    if not id_token:
        return jsonify({'error': 'ID Token missing'}), 400

    print(f"Received ID Token: {id_token}")

    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        print(f"UID from token: {uid}")

        session['user'] = {
            'uid': uid,
            'email': decoded_token['email']
        }

        return jsonify({'status': 'success', 'redirect': '/checkout'}), 200

    except Exception as e:
        print(f"Error verifying token: {e}")
        return jsonify({'error': str(e)}), 401

@app.route('/login')
def login():
    if session:
        print("Session data at /login route:")
        for key, value in session.items():
            print(f"  {key}: {value}")
    else:
        print("Session is empty at /login route")
    return render_template('login.html')

@app.route('/clear-session', methods=['POST'])
def clear_session():
    session.clear()
    print("Session cleared")
    return jsonify({'status': 'success'}), 200


@app.route('/menu')
def menu():
    return render_template('menu.html', title='Check the Menu', css='main')

@app.route('/checkout')
def checkout():
    if session:
        print("Session data at /checkout route:")
        for key, value in session.items():
            print(f"  {key}: {value}")
    else:
        print("Session is empty at /checkout route")    # Check if the user is logged in by verifying if 'user' is in session
    if 'user' not in session:
        # If user is not in session, redirect to the login page
        print("User not in session, redirecting to login")
        return redirect('/login')
    
    # # Generate CSRF token for additional security and set it in session
    session['CSRFToken'] = str(randint(1<<15, (1<<16)-1))
    print(f"CSRF Token set: {session['CSRFToken']}")
    
    # Render the checkout page if user is authenticated
    return render_template('checkout.html', title='Complete Your Purchase', css='checkout', CSRFToken=session['CSRFToken'])

@app.route('/about')
def about():
    return render_template('about.html', title='About Sky Munch', css='main')

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
    session['remember'] = request.form.get('remember')
    return redirect(url_for('delivery'))

@app.route('/delivery')
def delivery():
    if not session.get('first_name'):
        return redirect(url_for('menu'))

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
