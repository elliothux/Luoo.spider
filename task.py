# coding=utf-8
from spiders import start
from spiders import single_spider
from time import sleep
import sys
import io


if sys.platform != 'darwin':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def start_task():
    start.start()
    single_spider.start()
    print('----------- Task end, restart 2h later -----------')
    sleep(60*60*2)
    return start_task()


start_task()
