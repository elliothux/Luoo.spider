
import * as vol from './crawlers/vol';
import { cleanTemp, onExit } from './utils';
import { close } from './utils/color';
import {setInterval} from "timers";


async function launch() {
    onExit(close);
    cleanTemp();
    setInterval(cleanTemp, 1000 * 60 * 60);
    try {
        await vol.launch();
    } catch (e) {
        console.error(e);
        process.exit(0);
    }
}


launch().then(console.log).catch(console.error);
