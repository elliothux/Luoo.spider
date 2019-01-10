
import * as R from 'ramda';
import { VolTask, VolInfo, addVolTask, doneVolTask, isVolTaskExist } from '../../db/vol';
import { requestHTMLDOM, getPageURL } from '../../utils';


// 获取最后的Vol列表页的页码
async function getLastPage(): Promise<number> {
    const doc = await requestHTMLDOM('http://www.luoo.net/music');
    const navigator: Element[] = Array.from(doc.querySelectorAll('.paginator > .page'));
    const last = R.last(navigator).innerHTML;
    return parseInt(last);
}

// 传入Vol列表页的页码数，获取该页的 VolTasks
async function getVolPageTasks(page: number): Promise<VolTask[]> {
    const doc = await requestHTMLDOM(getPageURL(page));
    const vols = Array.from(doc.querySelectorAll('.vol-list > .item'));
    return R.map(getVolTaskFromVolNode, vols);
}

// 传入Vol列表页的 ElementNode，获取该页的 VolTasks
function getVolTaskFromVolNode(volNode: Element): VolTask {
    const a = volNode.querySelector('a.name');
    const info: string[] = a.innerHTML.split(' ');
    const vol = R.head(info).replace('vol.', '');
    const title: string = R.last(info).trim();

    return {
        vol: parseInt(vol),
        title,
        link: a.getAttribute('href'),
        done: false
    } as VolTask;
}

// 添加所有的 VolTasks
async function addVolTasks() {
    const lastPage = await getLastPage();
    for (let page = 1; page <= lastPage; page++) {
        const volTasks = await getVolPageTasks(page);
        for (let i = 0; i< volTasks.length; i++) {
            const task = volTasks[i];
            if (await isVolTaskExist(task.vol)) {
                return;
            }
            await addVolTask(task);
        }
    }
}

// 启动
async function launch() {
    await addVolTasks();
}


export {
    launch,
    getVolPageTasks
}