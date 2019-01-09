### RIP · 因 luoo.fm 停止运营，Luoo.qy 于2019年1月停止维护 · 落在低处

# Luoo
### 为 Luoo.qy 提供后端 API, 基于 Python、Node.js、Koa、MongoDB 等构建
![Alt text](preview.jpg "Preview")

## 1. 关于 / About
[落网 ( luoo.net )](http://www.luoo.net/) 一直是我很喜欢的一个音乐社区, 其中大量优质的独立音乐推荐很合我的口味, 他们十多年对音乐的坚持也让我充满敬意。落网是我手机上使用频率仅次于网易云的音乐软件, 但是电脑端却只能使用网页来听落网, 因此便决定给落网写电脑客户端。

* 客户端可以在 [http://l.page.中国](http://l.page.中国) 下载
* 客户端项目地址为 [Luoo.qy(GitHub)](https://github.com/HuQingyang/Luoo.qy)


## 2. 开发 / Development
* 设计工具: Sketch
* 开发平台: macOS Sierra、Windows 10
* 开发工具: WebStorm、PyCharm、SublimeText
* 客户端技术栈: Node.js、Electron、Vue、Vuex、NeDB、Webpack 等
* 后端技术栈: Node、Koa、Python、MongoDB、Urllib、BeautifulSoup 等

客户端项目结构:
```
├── README.md
├── requirements.txt
├── server (服务端目录)
│   ├── db.js (封装数据库操作)
│   ├── main.js (主进程)
│   ├── package.json (项目信息文件)
├── spiders (爬虫目录)
│   ├── __init__.py
│   ├── config.py (爬虫配置)
│   ├── cover_downloader.py (下载封面)
│   ├── db.py (封装数据库操作)
│   ├── lib.py (封装基础操作)
│   ├── single_spider.py (单曲爬虫)
│   ├── start.py (启动爬虫)
│   ├── task.py (爬取任务管理)
│   └── vol_spider.py (期刊爬虫)
├── task.py (启动任务)
└── website (网站目录)
```


## 4. API
服务端 API 可以通过 [http://l.page.中国/](http://l.page.中国/) 访问, 返回数据类型为 JSON

### /vol/\<volIndex\>
根据期刊数来获取期刊数据, 如 [http://l.page.中国/vol/717](http://l.page.中国/vol/717)

### /single/\<singleDate\>
根据发布日期来获取单曲数据, 如 [http://l.page.中国/single/20160722](http://l.page.中国/single/20160722)

### /vols/\<volIndex\>
根据当前期刊数来获取该期刊之后的所有新的期刊数据, 如 [http://l.page.中国/vols/926](http://l.page.中国/vols/926)

### /singles/\<singleDate\>
根据当前发布日期来获取该发布日期之后的所有新的单曲数据, 如 [http://l.page.中国/singles/20170628](http://l.page.中国/singles/20170628)

### /latest/\<type\>
获取最新的期刊数或单曲发布日期, 允许的 type 为 vol 或 single, 如 [http://l.page.中国/latest/vol](http://l.page.中国/latest/vol)

### /update/\<platform\>/\<preVersion\>
根据当前的版本与平台类型获取更新信息, 允许的 platform 值为 0(macOS)、1(Windows) 或 2(linux), 如 [http://l.page.中国/update/0/0.9](http://l.page.xn--fiqs8s/update/0/0.9)


##### 落 · 在低处 (2017/07/01)
