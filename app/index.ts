
import * as vol from './crawlers/vol';
import { cleanTemp } from './utils';
import {setInterval} from "timers";

process.on('uncaughtException', function (err) {
    console.log('error','UNCAUGHT EXCEPTION - keeping process alive:',  err);
});

async function launch() {
    cleanTemp();
    setInterval(cleanTemp, 1000 * 60 * 60);
    await vol.launch();
}


launch().then(console.log).catch(console.error);
