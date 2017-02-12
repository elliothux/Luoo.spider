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

    title = db.StringField(required=True)
    vol = db.IntField(required=True, unique=True)
    cover = db.StringField(required=True, unique=False)
    description = db.StringField(required=False, unique=False)
    date = db.StringField(required=True)
    list = db.ListField(db.ReferenceField(Track))
    length = db.IntField(required=True)
    tag = db.StringField(default=None)


def add_vol(title, vol, cover, description, date, length, tag):
    if Vol.objects(vol=vol).__len__() == 0:
        new_vol = Vol(
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


def add_track(vol, name, artist, album, cover, order, url, lyric=None):
    new_vol = Vol.objects(vol=vol)
    if new_vol.__len__() == 1:
        track = Track(
            vol=int(vol),
            name=name,
            artist=artist,
            album=album,
            cover=cover,
            order=order,
            url=url,
            lyric=lyric
        )
        track.save()

        new_vol = new_vol[0]
        new_vol.list.append(track)
        new_vol.save()
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
