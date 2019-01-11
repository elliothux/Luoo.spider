
import * as R from 'ramda';
import { VolTask, addVolTask, isVolTaskExist } from '../../db/vol';
import { requestHTMLDOM, getVolListPageURL, getVolIdFromURL, sleep } from '../../utils';
import config from "../../../config";


// 获取最后的Vol列表页的页码
async function getLastPage(): Promise<number> {
    const doc = await requestHTMLDOM('http://www.luoo.net/music');
    const navigator: Element[] = Array.from(doc.querySelectorAll('.paginator > .page'));
    const last = R.last(navigator).innerHTML;
    return parseInt(last);
}

// 传入Vol列表页的页码数，获取该页的 VolTasks
async function getVolPageTasks(page: number): Promise<VolTask[]> {
    const doc = await requestHTMLDOM(getVolListPageURL(page));
    const vols = Array.from(doc.querySelectorAll('.vol-list > .item'));
    return R.map(getVolTaskFromVolNode, vols);
}

// 传入Vol列表页的 ElementNode，获取该页的 VolTasks
function getVolTaskFromVolNode(volNode: Element): VolTask {
    const a = volNode.querySelector('a.name');
    const info: string[] = a.innerHTML.split(' ');
    const vol = R.head(info).replace('vol.', '');
    const title: string = R.last(info).trim();
    const link = a.getAttribute('href');
    const id = getVolIdFromURL(link);

    return {
        id,
        vol: parseInt(vol),
        title,
        link,
        done: false
    } as VolTask;
}

// 添加所有的 VolTasks
async function addVolTasks() {
    const lastPage = await getLastPage();
    // 遍历 VolList Page
    for (let page = 1; page <= lastPage; page++) {
        console.log(`add list page: ${page}`);
        const volTasks = await getVolPageTasks(page);
        // 遍历 Page 内的每一 Vol
        for (let i = 0; i< volTasks.length; i++) {
            const task = volTasks[i];
            // Task 已存在，停止遍历
            if (await isVolTaskExist(task.id)) {
                return;
            }
            await addVolTask(task);
            console.log(`add task: ${task.vol}`);
        }
        await sleep(config.SLEEP_DURATION);
    }
}


export {
    addVolTasks,
    getVolPageTasks
}
