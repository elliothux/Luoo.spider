# coding=utf-8
from spiders import start
from spiders import single_spider
from spiders.lib import log
from time import sleep


def start_task():
    log('----------- Start Task -----------')
    start.start()
    single_spider.start()
    log('----------- Task end, restart 2h later -----------')
    sleep(60*60*2)
    return start_task()


start_task()
