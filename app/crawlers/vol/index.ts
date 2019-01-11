import * as R from "ramda";
import {VolTask, VolInfo, getOneUnfinishedTask} from "../../db/vol";
import {Track} from '../../db/track';
import { requestHTMLDOM, getVolIdFromURL, getAverageColor } from '../../utils';
import { addVolTasks, getVolPageTasks } from './task';


async function getLatestVol(): Promise<number> {
    const tasks: VolTask[] = await getVolPageTasks(1);
    return R.head(tasks).vol;
}

async function getVolInfo(volTask: VolTask): Promise<VolInfo> {
    const doc = await requestHTMLDOM(volTask.link);
    const {
        id,
        vol,
        title,
        link,
    } = volTask;

    const cover = doc.querySelector('.vol-cover').getAttribute('src').trim();
    const color = await getAverageColor(cover);
    const author = doc.querySelector('.vol-author').innerHTML.trim();
    const authorAvatar = doc.querySelector('.author-avatar').getAttribute('src').trim();
    const date = doc.querySelector('.vol-date').innerHTML.trim();
    const desc = doc.querySelector('.vol-desc').innerHTML.trim();
    const tags = R.map<Element, string>(
        (i: Element) => i.innerHTML.replace('#', '').trim(),
        Array.from(doc.querySelectorAll('.vol-tag-item'))
    );
    const similarVols = R.map<Element, number>(
        (i: Element) => getVolIdFromURL(
            i.querySelector('.cover-wrapper').getAttribute('href')
        ),
        Array.from(doc.querySelectorAll('.relative-vol .item'))
    );

    const tracksNode = Array.from(doc.querySelectorAll('.vol-tracklist li.track-item'));
    const tracks = R.map(getTrackInfoFromNode, tracksNode);

    return {
        id,
        vol,
        title,
        link,
        cover,
        color,
        author,
        authorAvatar,
        date,
        desc,
        tags,
        similarVols,
        tracks
    } as VolInfo;
}

function getTrackInfoFromNode(trackNode: Element): Track {

}

async function getVols() {
    let task: VolTask;
    while (task = await getOneUnfinishedTask()) {
        const volInfo = await getVolInfo(task);
    }
}

// 启动
async function launch() {
    await addVolTasks();
    await getVols();
}

export {
    launch
}
