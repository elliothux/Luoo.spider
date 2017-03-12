from flask import Flask
from flask import render_template
from spiders import db


app = Flask(__name__)
app.config.from_object('config')


from app import models
from app import views
