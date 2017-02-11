from spiders import config
from spiders import db
from spiders import task


def get_vol(page):
    title = page.find({'span'}, {'class': 'vol-title'}).get_text()
    vol = int(page.find({'span'}, {'class': 'vol-number rounded'}).get_text())
    cover = page.find({'img'}, {'class': 'vol-cover'}).attrs['src']
    description = page.find({'div'}, {'class': 'vol-desc'}).get_text()
    date = page.find({'span'}, {'class': 'vol-date'}).get_text()
    tag = page.find({'a'}, {'class': 'vol-tag-item'})
    tag = tag and tag.get_text()

    list_data = page.findAll({'li'}, {'class': 'track-item rounded'})
    length = len(list_data)

    if db.Vol.objects(vol=vol).__len__() == 1:
        for track in db.Vol.objects(vol=vol)[0].list:
            track.delete()
        db.Vol.objects(vol=vol)[0].delete()

    new_vol = db.add_vol(
        title=title,
        vol=vol,
        cover=cover,
        description=description,
        date=date,
        length=length,
        tag=tag
    )

    if new_vol:
        get_all_track(vol, list_data)
        if task.check_task(vol):
            print('---------- Vol%s: %s 添加成功! -----------' % (vol, title))
            return True
        else:
            print('---------- Vol%s: %s 添加成功! 但所有曲目未正确添加! --------' % (vol, title))
    else:
        print('------------ Vol%s: %s 添加失败! ----------' % (vol, title))
        return False


def get_all_track(vol, list_data):
    for data in list_data:
        get_each_track(vol, data)


def get_each_track(vol, data):
    order = int(data.find({'a'}, {'class': 'trackname btn-play'}).get_text()[:2])

    data = data.find({'div'}, {'class': 'player-wrapper'})
    name = data.find({'p'}, {'class': 'name'}).get_text()
    artist = data.find({'p'}, {'class': 'artist'}).get_text()[8:]
    album = data.find({'p'}, {'class': 'album'}).get_text()[7:]
    cover = data.find({'img'}, {'class': 'cover rounded'}).attrs['src']
    url = config.TRACK_URL + str(vol) + '/' + str(order) + '.mp3'

    new_track = db.add_track(
        vol=vol,
        name=name,
        artist=artist,
        album=album,
        cover=cover,
        order=order,
        url=url
    )

    if new_track:
        print('%s - %s添加成功!' % (name, artist))
    else:
        print('%s - %s添加失败!' % (name, artist))
