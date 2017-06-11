# coding=utf-8
import mongoengine as db


db.connect('luoo')


class Task(db.Document):
    def __init__(self, *args, **kwargs):
        super(Task, self).__init__(*args, **kwargs)

    done = db.BooleanField(default=False)
    vol = db.IntField(required=True, unique=True)
    url = db.StringField(required=True)


class Track(db.Document):
    def __init__(self, *args, **kwargs):
        super(Track, self).__init__(*args, **kwargs)

    id = db.IntField(required=True)
    vol = db.IntField(required=True)
    name = db.StringField(required=True)
    artist = db.StringField(required=True)
    album = db.StringField(required=True)
    cover = db.StringField(required=True)
    order = db.IntField(required=True)
    url = db.StringField(required=True)
    lyric = db.StringField(required=False)


class Vol(db.Document):
    def __init__(self, *args, **kwargs):
        super(Vol, self).__init__(*args, **kwargs)

    id = db.IntField(required=True)
    title = db.StringField(required=True)
    vol = db.IntField(required=True, unique=True)
    cover = db.StringField(required=True, unique=False)
    description = db.StringField(required=False, unique=False)
    date = db.StringField(required=True)
    length = db.IntField(required=True)
    tag = db.ListField()


class Single(db.Document):
    def __init__(self, *args, **kwargs):
        super(Single, self).__init__(*args, **kwargs)

    id = db.IntField(required=True)
    from_id = db.IntField(required=True)
    name = db.StringField(required=True)
    artist = db.StringField(required=True)
    cover = db.StringField(required=True)
    url = db.StringField(required=True)
    description = db.StringField(required=True)
    date = db.StringField(required=True)
    recommender = db.StringField(required=True)


def add_vol(id, title, vol, cover, description, date, length, tag):
    if Vol.objects(vol=vol).__len__() == 0:
        new_vol = Vol(
            id=id,
            title=title,
            vol=vol,
            cover=cover,
            description=description,
            date=date,
            length=length,
            tag=tag
        )
        new_vol.save()
        return True
    return False


def add_track(id, vol, name, artist, album, cover, order, url, lyric=None):
    new_vol = Vol.objects(vol=vol)
    if new_vol.__len__() == 1:
        track = Track(
            vol=int(vol),
            id=id,
            name=name,
            artist=artist,
            album=album,
            cover=cover,
            order=order,
            url=url,
            lyric=lyric
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


def add_single(id, from_id, name, artist, cover, url, description, date, recommender):
    if Single.objects(date=date).__len__() == 0:
        new_single = Single(
            id=id,
            form_id=from_id,
            name=name,
            artist=artist,
            cover=cover,
            url=url,
            description=description,
            date=date,
            recommender=recommender
        )
        new_single.save()
        print('Add single success: %s - %s' %(name, artist))
        return True
    return False
