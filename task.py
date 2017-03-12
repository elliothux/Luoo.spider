from spiders import start
from spiders import single_spider
from time import sleep


def start_task():
    start.start()
    single_spider.start()
    print('----------- 本次爬取结束, 两个小时后再次爬取 -----------')
    sleep(60*60*2)
    return start_task()


start_task()
