from app import app
from app import models


@app.route('/api/vol/<index>')
def get_vol(index):
    return models.get_vol_list(index)


@app.route('/api/track/<vol>')
def get_track(vol):
    return models.get_track_list(vol)
