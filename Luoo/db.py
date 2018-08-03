# coding=utf-8

import mongoengine as db


db.connect('luoo')


class Task(db.Document):
    done = db.BooleanField(default=False)
    vol_id = db.IntField(required=True, unique=True)
    vol_name = db.StringField(required=True)


class Track(db.Document):
    vol_id = db.IntField(required=True)
    track_id = db.IntField(required=True, unique=True)
    track_order = db.IntField(required=True)
    track_name = db.StringField(required=True)
    track_artist = db.StringField(required=True)
    track_album = db.StringField(required=True)
    track_cover = db.StringField(required=True)


class Vol(db.Document):
    vol_id = db.IntField(required=True, unique=True)
    vol_name = db.StringField(required=True)
    vol_cover = db.StringField(required=True)
    vol_tags = db.ListField()
    vol_desc = db.StringField(required=False)
    vol_date = db.StringField(required=True)
    vol_length = db.IntField(required=True)


class Single(db.Document):
    def __init__(self, *args, **kwargs):
        super(Single, self).__init__(*args, **kwargs)

    single_id = db.IntField(required=True)
    from_id = db.IntField(required=True)
    name = db.StringField(required=True)
    artist = db.StringField(required=True)
    cover = db.StringField(required=True)
    url = db.StringField(required=True)
    description = db.StringField(required=True)
    date = db.IntField(required=True)
    recommender = db.StringField(required=True)
    color = db.ListField(required=True)


class Log(db.Document):
    def __init__(self, *args, **kwargs):
        super(Log, self).__init__(*args, **kwargs)

    date = db.DateTimeField(required=True)
    ip = db.StringField(required=True)
    api = db.StringField(required=True)


def add_vol(id, title, vol, cover, description, date, length, tag, color):
    if Vol.objects(vol=vol).__len__() == 0:
        new_vol = Vol(
            vol_id=id,
            title=title,
            vol=vol,
            cover=cover,
            description=description,
            date=date,
            length=length,
            tag=tag,
            color=color
        )
        new_vol.save()
        return True
    return False


def add_track(id, vol, name, artist, album, cover, order, url, color, lyric=None):
    new_vol = Vol.objects(vol=vol)
    if new_vol.__len__() == 1:
        track = Track(
            vol=int(vol),
            track_id=id,
            name=name,
            artist=artist,
            album=album,
            cover=cover,
            order=order,
            url=url,
            lyric=lyric,
            color=color
        )
        track.save()
        return True
    return False


def add_task(vol, url):
    if Task.objects(vol=vol).__len__() == 0:
        task = Task(
            vol=vol,
            url=url
        )
        task.save()
        return True
    return False


def add_single(id, from_id, name, artist, cover, url, description, date, recommender, color):
    if Single.objects(date=date).__len__() == 0:
        new_single = Single(
            single_id=id,
            from_id=from_id,
            name=name,
            artist=artist,
            cover=cover,
            url=url,
            description=description,
            date=date,
            recommender=recommender,
            color=color
        )
        new_single.save()
        return True
    return False
