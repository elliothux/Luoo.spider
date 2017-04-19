from flask import Flask
from spiders import db
from flask import render_template


app = Flask(__name__)
app.config.from_object('config')


from app import models
from app import views
