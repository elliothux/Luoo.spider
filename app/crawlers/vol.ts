
import * as R from 'ramda';
import { requestHTMLDOM } from '../utils';


async function getLastPage(): Promise<number> {
    const doc = await requestHTMLDOM('http://www.luoo.net/music');
    const navigator: Element[] = Array.from(doc.querySelectorAll('.paginator > .page'));
    const last = R.last(navigator).innerHTML;
    return parseInt(last);
}

async function init() {
    console.log(await getLastPage());
}

init().then(console.log).catch(console.error);
