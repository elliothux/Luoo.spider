# coding=utf-8
import time
import random
import urllib.request
import urllib.error
from random import choice
from bs4 import BeautifulSoup
from spiders import config
from PIL import Image



def load_page(url, times=0, raw=False):
    head = {'User-Agent': choice(config.USER_AGENT)}
    request = urllib.request.Request(headers=head, url=url)

    try:
        response = urllib.request.urlopen(request)
        return response.read() if raw else BeautifulSoup(response.read(), 'html5lib')

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


def get_average_color(url):
    image = load_page(url=url, raw=True)
    if not image:
        print('封面获取失败 %s' % url)
        return [0, 0, 0]
    with open('_temp.jpg', 'wb') as handler:
        handler.write(image)
    image = Image.open('_temp.jpg')
    image = image.convert('RGB')
    colors = [None, None, None]
    for channel in range(3):
        pixels = image.getdata(band=channel)
        values = []
        for pixel in pixels:
            values.append(pixel)
        colors[channel] = round(sum(values) / len(values), 2)
    return colors
