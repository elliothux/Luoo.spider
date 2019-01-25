import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as request from "request";
import * as R from 'ramda';
import {JSDOM} from "jsdom";
import * as constants from './constants';
import { getAverageColor as getAverageColorFromPath } from './color';


function requestHTML(uri: string): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
        const options = {
            uri,
            headers: {
                'User-Agent': randomUA()
            }
        };
        request(options, function (error, response, body) {
            if (error || !response || response.statusCode !== 200) {
                return reject(error);
            }
            resolve(body);
        })
    }));
}

function htmlToDOM(html: string): Document {
    const { window: { document } } = new JSDOM(html);
    return document;
}

async function requestHTMLDOM(url: string): Promise<Document> {
    try {
        const html = await requestHTML(url);
        return htmlToDOM(html);
    } catch (e) {
        console.error('Request HTML failed: ', e);
    }
}

function getVolListPageURL(page: number): string{
    return `http://www.luoo.net/tag/?p=${page}`;
}

function getVolPageURL(vol: number): string {
    return `http://www.luoo.net/vol/index/${vol}`;
}

function getVolIdFromURL(link: string): number {
    return parseInt(R.last(link.split('/vol/index/')))
}

function downloadFile(uri: string, path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const stream = fs.createWriteStream(path);
        const options = {
            uri,
            headers: {
                'User-Agent': randomUA()
            }
        };
        if (!uri) {
            throw `URL null: ${uri}`;
        }
        request(options)
            .pipe(stream)
            .on('close', (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            }
        );
    });
}

async function getAverageColor(imgURL: string): Promise<string> {
    const tempPath = path.join(__dirname, `../../temp/${md5(imgURL)}.jpg`);
    await downloadFile(imgURL, tempPath);
    return getAverageColorFromPath(tempPath);
}

function handleImgSrc(src: string): string {
    return R.head(src.split('!/'));
}

function randomUA(): string {
    const USER_AGENTS = [
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; AcooBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
        "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)",
        "Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
        "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
        "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
        "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)",
        "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
        "Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6",
        "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1",
        "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
        "Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5",
        "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20",
        "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
    ];
    // TODO
    return USER_AGENTS[0];
}

function md5(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
}

async function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
       setTimeout(resolve, duration);
    });
}

function cleanTemp() {
    const tempPath = path.join(__dirname, '../../temp');
    R.map((p) => {
        if (fs.existsSync(p)) {
            fs.unlinkSync(p);
            console.log(`clean file: ${p}`);
        }
    }, fs.readdirSync(tempPath).map(i => path.join(tempPath, i)));
}

function onExit(exitHandler: () => any) {
    process.on('exit', exitHandler.bind(null,{cleanup:true}));
    process.on('SIGINT', exitHandler.bind(null, {exit:true}));
    process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
    process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
}


export {
    requestHTMLDOM,
    getVolPageURL,
    getVolListPageURL,
    getVolIdFromURL,
    getAverageColor,
    downloadFile,
    randomUA,
    constants,
    handleImgSrc,
    sleep,
    cleanTemp,
    onExit
}
