import * as request from "request";
import {JSDOM} from "jsdom";


function requestHTML(url: string): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
        request(url, function (error, response, body) {
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
    const html = await requestHTML(url);
    require('fs').writeFileSync('temp.html', html);
    return htmlToDOM(html);
}

function getPageURL(page: number): string{
    return `http://www.luoo.net/tag/?p=${page}`;
}

export {
    requestHTMLDOM,
    getPageURL
}
