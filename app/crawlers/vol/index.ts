import * as R from "ramda";
import {VolTask, VolInfo, getUnfinishedTasks, saveVol, doneVolTask, undoneVolTasks} from "../../db/vol";
import {VolTrack} from '../../db/track';
import {requestHTMLDOM, getVolIdFromURL, getAverageColor, handleImgSrc, sleep} from '../../utils';
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

    const cover = handleImgSrc(doc.querySelector('.vol-cover').getAttribute('src').trim());
    const color = await getAverageColor(cover);
    const author = doc.querySelector('.vol-author').innerHTML.trim();
    const authorAvatar = handleImgSrc(doc.querySelector('.author-avatar').getAttribute('src').trim());
    const date = doc.querySelector('.vol-date').innerHTML.trim();
    const desc = formatVolDesc(doc);
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
    const tracks = await Promise.all<VolTrack>(
        R.filter(
            i => !!i,
            R.map(
                async (trackNode) => await getTrackInfoFromNode(trackNode, volTask),
                tracksNode
            )
        )
    );

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

function formatVolDesc(doc: Document): string {
    const { innerHTML: desc } = doc.querySelector('.vol-desc');
    return desc.replace(/<script>.*<\/script>/, '');
}
async function getTrackInfoFromNode(trackNode: Element, volTask: VolTask): Promise<VolTrack> {
    const { vol } = volTask;

    const id = parseInt(
        trackNode.querySelector('.btn-action-like')
            .getAttribute('data-id')
    );
    // 去除脏数据
    if (isNaN(id)) {
        return null;
    }
    const player = trackNode.querySelector('.player-wrapper');
    const name = player.querySelector('p.name').innerHTML.trim();
    const artist = player.querySelector('p.artist').innerHTML
        .replace('Artist:', '').trim();
    const album = player.querySelector('p.album').innerHTML
        .replace('Album:', '').trim();
    const cover = handleImgSrc(player.querySelector('img.cover').getAttribute('src').trim());
    const color = await getAverageColor(cover);
    const order = trackNode.querySelector('.trackname.btn-play').innerHTML.slice(0, 2);
    const url = `http://mp3-cdn2.luoo.net/low/luoo/radio${vol}/${order}.mp3`;

    return {
        id,
        vol,
        name,
        artist,
        album,
        cover,
        url,
        color
    } as VolTrack;
}

async function getVols() {
    const tasks: VolTask[] = await getUnfinishedTasks();
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        console.log(`get vol ${task.vol}`);
        let volInfo;
        try {
            volInfo = await getVolInfo(task);
        } catch (e) {
            console.error(`Get vol-${task.vol} failed: `, e);
            throw e;
            // continue;
        }
        await saveVol(volInfo);
        await doneVolTask(volInfo.id);
        console.log(`save vol ${volInfo.vol} ${volInfo.title}`);
        await sleep(Math.min(2, Math.random() * 6) * 1000);
    }
}

// 启动
async function launch() {
    // await undoneVolTasks();
    console.log('Start add tasks');
    await addVolTasks();
    console.log('All tasks added');
    await getVols();
}

export {
    launch
}
