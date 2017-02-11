from spiders import lib
from spiders import db
from spiders import spider
from spiders import task
from random import random
from time import sleep


if __name__ == '__main__':
    task.get_task()
    all_task = db.Task.objects(done=False)
    for task in all_task:
        url = task.url
        page = lib.load_page(url)
        spider.get_vol(page)
        sleep_time = int(random()*10)
        print('/////// sleep: %ss ////////' % sleep_time)
        sleep(sleep_time)

