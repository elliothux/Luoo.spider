# coding=utf-8

import scrapy


class SingleSpider(scrapy.Spider):
    name = 'vol'
    allowed_domains = 'www.luoo.net'
    start_urls = ['http://www.luoo.net/musician/?p=1']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) \
        AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    }

    def parse(self, response):
        pass

    def extract_banner_single(self, response):
        banner = response.css('div.musician-banner')
        single_name = response.css('div.meta > a.title::text')[0].extract()
        single_artist = response.css('div.meta > p.performer::text')[0].extract()
        [single_referrer, single_date] = response.css('div.meta > p.date::text')[0].extract().split('・')
        single_referrer = single_referrer[0].replace('推荐人：', '').strip()
        pass

    def extract_singles(self, response):
        pass
