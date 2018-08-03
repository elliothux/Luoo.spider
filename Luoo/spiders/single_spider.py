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

    @staticmethod
    def extract_banner_single(response):
        banner = response.css('div.musician-banner')
        single_name = response.css('div.meta > a.title::text')[0].extract()
        single_artist = response.css('div.meta > p.performer::text')[0].extract()
        [single_referrer, single_date] = response.css('div.meta > p.date::text')[0].extract().split('・')
        single_referrer = single_referrer[0].replace('推荐人：', '').strip()
        single_desc = banner.css('div.meta > p.remark > span')[1].css('::text')[0].extract()

    @staticmethod
    def extract_singles(response):
        return map(
            SingleSpider.extract_single,
            response.css('div.musician-list > div.item')
        )

    @staticmethod
    def extract_single(single):
        single_name = single.css('div.musician-wrapper > a.title::text')[0].extract()
        single_artist = single.css('div.musician-wrapper > p.performer::text')[0].extract()
        [single_referrer, single_date] = single.css('div.musician-wrapper > p.date::text')[0].extract().split('・')
        single_referrer = single_referrer[0].replace('推荐人：', '').strip()
        single_desc = single.css('div.musician-wrapper > p.remark > span')[1].css('::text')[0].extract()
