from flask import render_template

from application import app


@app.route('/')
@app.route('/home')
def home():
    return render_template('layout.html')
    # return render_template('index.html', title='Home')


"""
@app.route('/welcome/<name>')
def welcome(name):
    return render_template('welcome.html', name=name, group='Everyone')
"""