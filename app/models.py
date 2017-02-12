from app import db
from flask import jsonify

vol = db.Vol
track = db.Track


def get_vol_list(index):
    index = int(index)
    max_index = vol.objects().__len__()
    if index*10 > max_index:
        return jsonify({'status': 0})
    start_index = index * 10
    end_index = start_index + 10 if start_index+10 <= max_index else max_index
    return db.Vol.objects()[start_index: end_index].to_json()


def get_track_list(vol_index):
    track_list = track.objects(vol=int(vol_index))
    return track_list.to_json()
