# coding=utf-8
import urllib.request
import time
import random
import urllib.request
import urllib.error
from random import choice
from bs4 import BeautifulSoup
from spiders import config


# 传入URL, 以bytes返回页面源码
def load_page(url, times=0):
    head = {'User-Agent': choice(config.USER_AGENT)}
    request = urllib.request.Request(headers=head, url=url)

    try:
        response = urllib.request.urlopen(request)
        return BeautifulSoup(response.read(), 'html5lib')

    except urllib.error.URLError or urllib.error.HTTPError as e:
        if times <= config.MAX_TRY_TIMES:
            sleep_time = random.randint(5, 10)
            print('载入页面失败, %s秒后重试' % (str(sleep_time)))
            print(e)
            time.sleep(sleep_time)
            times += 1
            load_page(url, times=times)
        else:
            return False
