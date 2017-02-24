from app import db
from flask import jsonify

vol = db.Vol
track = db.Track


def get_vol(index):
    return vol.objects(vol = int(index))[0].to_json()

def get_track_list(vol_index):
    track_list = track.objects(vol=int(vol_index))
    return track_list.to_json()


def get_latest_vol():
    return db.Vol.objects.__len__() + 4
