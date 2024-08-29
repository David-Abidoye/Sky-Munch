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


@app.route('/deliverystatus')
def deliverystatus():
    return render_template('deliverystatus.html', title='Delivery in Progress')