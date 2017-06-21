# coding=utf-8
from spiders import config
from spiders import lib
from spiders import db
import sys
import io


# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def get_latest_vol():
    page = 1
    url = config.START_URL + str(page)
    latest_page = lib.load_page(url)
    if latest_page:
        latest_vol = latest_page.find({'div'}, {'class': 'vol-list'})\
            .find({'a'}, {'class': 'name'})\
            .get_text().split('.')[1].split(' ')[0]
        return int(latest_vol)
    return False


def get_task():
    latest_vol = get_latest_vol()
    for vol in range(latest_vol, 0, -1):
        if vol not in config.DISAPPEAR_VOL:
            url = config.VOL_URL + str(vol)
            if db.add_task(vol=vol, url=url):
                print('已添加任务: Vol%s' % vol)
            else:
                print('所有任务添加完毕!')
                return True


def check_task(vol):
    new_vol = db.Vol.objects(vol=vol)[0]
    if new_vol.length == db.Track.objects(vol=vol).__len__():
        task = db.Task.objects(vol=vol)[0]
        task.done = True
        task.save()
        return True
    return False
