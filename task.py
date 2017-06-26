# coding=utf-8
from spiders import start
from spiders import single_spider
from time import sleep


def start_task():
    print('----------- Start Task -----------')
    start.start()
    single_spider.start()
    print('----------- Task end, restart 2h later ----------')
    sleep(60*60*2)
    return start_task()


start_task()
