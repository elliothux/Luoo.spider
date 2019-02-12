import * as R from "ramda";
import {
    requestHTMLDOM,
    getVolIdFromURL,
    getAverageColor,
    handleVolImgSrc,
    sleep,
    handleSingleImgSrc,
    formatDesc, getVolListPageURL
} from "../../utils";
import {
    addArticleTask,
    ArticleTask,
    isArticleTaskExist,
    getUnfinishedTasks,
    Article,
    saveArticle, doneArticleTask, ArticleTrack, undoneArticleTasks
} from "../../db/article";
import config from "../../../config";


const URL = "http://www.luoo.net/essays/";

async function getPageCount(): Promise<number> {
    const doc = await requestHTMLDOM(URL);
    const page: HTMLElement = R.last(
        Array.from(doc.querySelectorAll(".paginator > a.page"))
    );
    return parseInt(page.innerHTML);
}

// 添加所有的 ArticleTasks
async function addArticleTasks() {
    const lastPage = await getPageCount();
    // 遍历 ArticleTasks Page
    for (let page = 1; page <= lastPage; page++) {
        console.log(`add list page: ${page}`);
        const articleTasks = await getArticlePageTasks(page);
        // 遍历 Page 内的每一 Article
        for (let i = 0; i < articleTasks.length; i++) {
            const task = articleTasks[i];
            // Task 已存在，停止遍历
            if (await isArticleTaskExist(task.id)) {
                return;
            }
            await addArticleTask(task);
            console.log(`add task: ${task.id}`);
        }
        await sleep(config.SLEEP_DURATION);
    }
}

async function getArticlePageTasks(page: number): Promise<ArticleTask[]> {
    const doc = await requestHTMLDOM(`http://www.luoo.net/essay/index/p/${page}`);
    const articles = Array.from(doc.querySelectorAll(".essay-list > .item")) as HTMLElement[];
    if (page === 1) {
        const banner = doc.querySelector('.essay-banner') as HTMLElement;
        articles.push(banner);
    }
    const tasks: ArticleTask[] = [];
    for (let node of articles) {
        tasks.push(await getSingleTaskFromSingleNode(node));
    }
    return tasks;
}

async function getSingleTaskFromSingleNode(node: HTMLElement): Promise<ArticleTask> {
    const link = node.querySelector('a.title').getAttribute('href');
    const id = parseInt(R.last(link.split('/')));
    return {
        id,
        done: false
    } as ArticleTask;
}

async function getArticleInfo(task: ArticleTask): Promise<Article> {
    const url = `http://www.luoo.net/essay/${task.id}`;
    const doc = await requestHTMLDOM(url);
    const title = doc.querySelector('h1.essay-title').innerHTML.trim();
    const metaInfo = doc.querySelector('p.essay-meta').textContent.trim();
    const desc = doc.querySelector('div.essay-content').innerHTML.trim();
    const author = doc.querySelector('a.essay-author-name').textContent.trim();
    const authorAvatar = doc.querySelector('div.essay-author img.avatar').getAttribute('src');

    const tracksNode = Array.from(doc.querySelectorAll('.essay-music .track-item')) as HTMLElement[];
    const tracks = await Promise.all<ArticleTrack>(
        tracksNode.map(
            (trackNode: HTMLElement, index: number) => getArticleTrack(trackNode, index, metaInfo, task.id)
        )
    );

    return {
        id: task.id,
        title,
        metaInfo,
        url,
        desc,
        author,
        authorAvatar,
        tracks
    } as Article;
}

async function getArticleTrack(node: HTMLElement, index: number, metaInfo: string, articleId: number): Promise<ArticleTrack> {
    const id = parseInt(node.querySelector('a.btn-action-share').getAttribute('data-id'));
    const player = node.querySelector('.player-wrapper');
    const name = player.querySelector("p.name").innerHTML.trim();
    const artist = player
        .querySelector("p.artist")
        .innerHTML.replace("艺人：", "")
        .trim();
    const album = player
        .querySelector("p.album")
        .innerHTML.replace("专辑：", "")
        .trim();
    const cover = handleVolImgSrc(
        player
            .querySelector("img.cover")
            .getAttribute("src")
            .trim()
    );
    // const color = await getAverageColor(cover);
    const color = "";
    const date = R.last(metaInfo.split('・')).replace(/-/g, '').trim();
    const order = index > 9 ? `${index}` : `0${index}`;
    const url = `http://mp3-cdn2.luoo.net/low/${date.slice(0, 4)}/${date.slice(4, 8)}_${order}.mp3`;
    return {
        id,
        articleId,
        name,
        artist,
        album,
        cover,
        url,
        color
    } as ArticleTrack;
}


async function getArticles() {
    const tasks: ArticleTask[] = await getUnfinishedTasks();
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        console.log(`get article ${task.id}`);
        let articleInfo;
        try {
            articleInfo = await getArticleInfo(task);
        } catch (e) {
            console.error(`Get article-${articleInfo.id} failed: `, e);
            throw e;
        }
        await saveArticle(articleInfo);
        await doneArticleTask(task.id);
        console.log(`save article ${task.id} ${articleInfo.title}`);
        await sleep(Math.min(2, Math.random() * 6) * 1000);
    }
}

async function launch() {
    // await undoneArticleTasks();
    console.log("Start add tasks");
    await addArticleTasks();
    console.log("All tasks added");
    await getArticles();
}


launch().then(() => {
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit();
});
