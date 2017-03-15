from app import app
from app import models
from app import render_template
import json


# Site
@app.route('/luoo.qy')
def index():
    return render_template('index.html')


# Api to get data
@app.route('/api/vol/<vol>')
def get_vol(vol):
    return models.get_vol(vol)


@app.route('/api/latestVol')
def get_latest_vol():
    return str(models.get_latest_vol())


@app.route('/api/singlesList')
def get_singles_list():
    return models.get_singles_list()


@app.route('/api/single/<date>')
def get_single(date):
    return models.get_single(date)


# Api to update
@app.route('/api/updateInfo')
def get_update_file():
    return json.dumps({
        'url': 'http://ojt6rsn4s.bkt.clouddn.com/v%s.zip' % app.config['LATEST_VERSION'],
        'version': str(app.config['LATEST_VERSION'])
    })
