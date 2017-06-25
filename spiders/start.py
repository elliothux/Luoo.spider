# coding=utf-8
from spiders import lib
from spiders import db
from spiders import vol_spider
from spiders import task
from spiders.lib import log
from time import sleep
from random import random


get_task = task.get_task


def start():
    get_task()
    all_task = db.Task.objects(done=False)
    for each in all_task:
        url = each.url
        page = lib.load_page(url)
        vol_spider.get_vol(page)
        sleep_time = int(random()*10)
        log('/////// sleep: %ss ////////' % sleep_time)
        sleep(sleep_time)


if __name__ == '__main__':
    start()
