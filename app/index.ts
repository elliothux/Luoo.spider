
import * as vol from './crawlers/vol';


async function launch() {
    await vol.launch();
}


launch().then(console.log).catch(console.error);
