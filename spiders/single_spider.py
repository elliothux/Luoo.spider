# coding=utf-8
from spiders import db
from spiders import lib
from spiders import config
from time import sleep
from random import random
from os import path
import json


def get_pages_num():
    page = lib.load_page(config.SINGLE_URL + '1')
    page_num = page.findAll({'a'}, {'class': 'page'})
    return int(page_num[-1].get_text())


def get_singles_from_page(page_num):
    page = lib.load_page(config.SINGLE_URL + str(page_num))

    success = get_first_single(page)
    if not success:
        return False

    success = get_others_singles(page)
    if not success:
        return False

    return True


def get_first_single(page):
    first_single = page.find({'div'}, {'class': 'musician-banner'})
    id_data = first_single.find({'a'}, {'class': 'btn-action-like'})
    id = int(id_data.attrs['data-id'])
    from_id = int(id_data.attrs['data-from_id'])
    cover = first_single.find({'img'}, {'class': 'cover'}).attrs['src']
    meta = first_single.find({'div'}, {'class': 'meta'})
    name = meta.find({'a'}).get_text().replace(' ', '').replace('\n', '').replace('\t', '')
    artist = meta.find({'p'}, {'class': 'performer'}).get_text()
    description = meta.find({'p'}, {'class': 'remark'}).get_text()
    recommender = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[0]
    date = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[1].replace('-', '')
    url = config.SINGLE_TRACK_URL + date + '.mp3'

    return db.add_single(
        id=id,
        from_id=from_id,
        name=name,
        artist=artist,
        cover=cover,
        url=url,
        description=description,
        date=date,
        recommender=recommender
    )


def get_others_singles(page):
    single_list = page.find({'div'}, {'class': 'musician-list'})
    singles = single_list.findAll({'div'}, {'class': 'item'})
    for each in singles:
        id_data = each.find({'a'}, {'class': 'btn-action-like'})
        id = int(id_data.attrs['data-id'])
        from_id = int(id_data.attrs['data-from_id'])
        cover = each.find({'img'}, {'class': 'cover'}).attrs['src']
        meta = each.find({'div'}, {'class': 'musician-wrapper'})
        name = meta.find({'a'}, {'class': 'title'}).get_text().replace(' ', '').replace('\n', '').replace('\t', '')
        artist = meta.find({'p'}, {'class': 'performer'}).get_text()
        description = meta.find({'p'}, {'class': 'remark'}).get_text()
        recommender = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[0]
        date = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[1].replace('-', '')
        url = config.SINGLE_TRACK_URL + date + '.mp3'

        success = db.add_single(
            id=id,
            from_id=from_id,
            name=name,
            artist=artist,
            cover=cover,
            url=url,
            description=description,
            date=int(date),
            recommender=recommender
        )

        if not success:
            return False
    return True


def updateInfoFile(date):
    file_path = path.abspath(path.join(path.dirname(__file__), '../server/package.json'))
    info = json.load(open(file_path, 'r'))
    if int(date) < int(info['config']['latestSingle']):
        return
    info['config']['latestSingle'] = int(date)
    with open(file_path, 'w') as f:
        json.dump(info, f)


def start():
    pages = get_pages_num()
    for page in range(1, pages):
        success = get_singles_from_page(page)
        if not success:
            print('Get singles success!')
            return False
        sleep_time = int(random() * 10)
        print('/////// sleep: %ss ////////' % sleep_time)
        sleep(sleep_time)


if __name__ == '__main__':
    start()
