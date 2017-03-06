from spiders import db
from spiders import lib
from spiders import config
from time import sleep
from random import random


def get_pages_num():
    page = lib.load_page(config.SINGLE_URL + '1')
    page_num = page.findAll({'a'}, {'class': 'page'})
    return int(page_num[-1].get_text())


def get_singles_from_page(page_num):
    page = lib.load_page(config.SINGLE_URL + str(page_num))
    get_first_single(page)
    get_others_singles(page)


def get_first_single(page):
    first_single = page.find({'div'}, {'class': 'musician-banner'})
    cover = first_single.find({'img'}, {'class': 'cover'}).attrs['src']
    meta = first_single.find({'div'}, {'class': 'meta'})
    name = meta.find({'a'}).get_text().replace(' ', '').replace('\n', '').replace('\t', '')
    artist = meta.find({'p'}, {'class': 'performer'}).get_text()
    description = meta.find({'p'}, {'class': 'remark'}).get_text()
    recommender = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[0]
    date = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[1]
    url = config.SINGLE_TRACK_URL + date.replace('-', '') + '.mp3'

    return db.add_single(
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
        cover = each.find({'img'}, {'class': 'cover'}).attrs['src']
        meta = each.find({'div'}, {'class': 'musician-wrapper'})
        name = meta.find({'a'}, {'class': 'title'}).get_text().replace(' ', '').replace('\n', '').replace('\t', '')
        artist = meta.find({'p'}, {'class': 'performer'}).get_text()
        description = meta.find({'p'}, {'class': 'remark'}).get_text()
        recommender = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[0]
        date = meta.find({'p'}, {'class': 'date'}).get_text().split('・')[1]
        url = config.SINGLE_TRACK_URL + date.replace('-', '') + '.mp3'

        db.add_single(
            name=name,
            artist=artist,
            cover=cover,
            url=url,
            description=description,
            date=date,
            recommender=recommender
        )


if __name__ == '__main__':
    for page in range(1, 62):
        get_singles_from_page(page)
        sleep_time = int(random() * 10)
        print('/////// sleep: %ss ////////' % sleep_time)
        sleep(sleep_time)
