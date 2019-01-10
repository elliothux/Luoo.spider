
import { requestHTMLDOM } from './utils';


async function init() {
    const doc = await requestHTMLDOM('http://www.luoo.net/music');
    const navigator = doc.querySelector('.paginator');
    debugger;
    console.log(navigator);
}

init().then(console.log).catch(console.error);
