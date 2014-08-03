#!/usr/bin/python

from flask import Flask, make_response, render_template, request
import os.path, sys, json
from src import handler

app = Flask(__name__, static_folder='static', static_url_path='')
app.debug = True
app.secret_key = '@#0-fgljrl230i-0diflkjdflsdf'

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/ajax', methods=['POST'])
def ajax():
	print(request.environ["werkzeug.request"].__dict__)
	data = json.loads(request.data)
	handler.RequestHandler(data).handle()
	return self.response

if (app.debug):
    from werkzeug.debug import DebuggedApplication
    app.wsgi_app = DebuggedApplication( app.wsgi_app, True )

if __name__ == '__main__':
    app.run()
