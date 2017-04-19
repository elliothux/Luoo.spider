from app import db
from spiders import config
import json

vol = db.Vol
track = db.Track
single = db.Single


def get_latest_vol():
    return db.Vol.objects.__len__() + len(config.DISAPPEAR_VOL)


def get_vol(index):
    if int(index) in config.DISAPPEAR_VOL:
        return json.dumps({'error': 'vol not exist'})

    vol_data = json.loads(_data2json(vol.objects(vol=int(index))[0]))
    vol_data['tracks'] = _get_track_list(index)
    return json.dumps(vol_data)


def _get_track_list(vol_index):
    track_list = track.objects(vol=int(vol_index))
    track_list_data = []
    for each in track_list:
        track_list_data.append(_data2json(each))
    return json.dumps(track_list_data)


def _data2json(data):
    json_data = {}
    for each in data:
        if each != 'id':
            json_data[each] = data[each]
    return json.dumps(json_data)


def get_singles_list():
    singles_list = []
    for each in single.objects():
        singles_list.append(each.date)
    return json.dumps(singles_list)


def get_single(date):
    single_data = single.objects(date=date)
    if single_data.__len__() == 0:
        return json.dumps({'error': 'single not exist'})
    return _data2json(single_data[0])
