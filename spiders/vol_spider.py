# coding=utf-8
from spiders import config
from spiders import db
from spiders import task
from bs4 import BeautifulSoup
from os import path
import json


def get_vol(page):
    def tag_data_to_tag(each):
        return each and each.get_text()

    # 获得 Vol 信息
    id = int(page.find({'a'}, {'class': 'btn-action-like'}).attrs['data-id'])
    title = page.find({'span'}, {'class': 'vol-title'}).get_text()
    vol = int(page.find({'span'}, {'class': 'vol-number rounded'}).get_text())
    cover = page.find({'img'}, {'class': 'vol-cover'}).attrs['src']
    description = page.find({'div'}, {'class': 'vol-desc'}).get_text().replace('\n', '<br>')
    date = page.find({'span'}, {'class': 'vol-date'}).get_text()
    tags_data = page.findAll({'a'}, {'class': 'vol-tag-item'})
    tag = map(tag_data_to_tag, tags_data)


    # 获得 Track 信息
    list_data = page.findAll({'li'}, {'class': 'track-item rounded'})
    length = len(list_data)

    # 如果 Vol 已存在但任务未完成, 删除该 Vol 的所有 Track并删除该 Vol
    if db.Vol.objects(vol=vol).__len__() == 1:
        for track in db.Track.objects(vol=vol):
            track.delete()
        db.Vol.objects(vol=vol)[0].delete()

    # 添加 Vol
    new_vol = db.add_vol(
        id=id,
        title=title,
        vol=vol,
        cover=cover,
        description=description,
        date=date,
        length=length,
        tag=tag
    )

    # 添加 Vol 成功
    if new_vol:
        # 开始获取 Track
        get_all_track(vol, list_data)
        if task.check_task(vol):
            updateInfoFile(vol)
            print('----------- Vol%s: %s 添加成功! -----------' % (vol, title))
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
    order = '0' + str(order) if order < 10 else order
    id = int(data.find({'a'}, {'class': 'btn-action-share icon-share'}).attrs['data-id'])

    data = data.find({'div'}, {'class': 'player-wrapper'})
    name = data.find({'p'}, {'class': 'name'}).get_text()
    artist = data.find({'p'}, {'class': 'artist'}).get_text()[8:]
    album = data.find({'p'}, {'class': 'album'}).get_text()[7:]
    cover = data.find({'img'}, {'class': 'cover rounded'}).attrs['src']
    url = config.TRACK_URL + str(vol) + '/' + str(order) + '.mp3'

    new_track = db.add_track(
        id=id,
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


def updateInfoFile(vol):
    file_path = path.abspath(path.join(path.dirname(__file__), '../server/package.json'))
    info = json.load(open(file_path, 'r'))
    if int(vol) < int(info['config']['latestVol']):
        return
    info['config']['latestVol'] = int(vol)
    with open(file_path, 'w') as f:
        json.dump(info, f)
