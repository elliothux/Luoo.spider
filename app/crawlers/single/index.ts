import * as R from "ramda";
import {
  requestHTMLDOM,
  getVolIdFromURL,
  getAverageColor,
  handleVolImgSrc,
  sleep,
  handleSingleImgSrc
} from "../../utils";
import { Single } from "../../db/single";

const URL = "http://www.luoo.net/musician";

async function getPageCount(): Promise<number> {
  const doc = await requestHTMLDOM(URL);
  const page: HTMLElement = R.last(
    Array.from(doc.querySelectorAll(".paginator > a.page"))
  );
  return parseInt(page.innerHTML);
}

async function getSinglesFromPage(page: number): Promise<Single[]> {
  const url = `http://www.luoo.net/musician/?p=${page}`;
  const doc = await requestHTMLDOM(url);
  const singles: Single[] = [];
  singles.push(await getBannerSingle(doc));
  return singles;
}

async function getBannerSingle(doc: Document): Promise<Single> {
  const banner = doc.querySelector(".musician-banner");
  const id = parseInt(banner.querySelector('a.btn-action-like').getAttribute('data-id'));
  const meta = banner.querySelector('div.meta');
  const name = meta.querySelector('a.title').innerHTML.trim();
  const artist = meta.querySelector('p.performer').innerHTML.trim();
  const desc = meta.querySelector('p.remark').innerHTML.trim();
  const remarkInfo = meta.querySelector('p.date').innerHTML.trim();
  const [recommender, date] = remarkInfo
      .replace('推荐人', '')
      .replace('：', '')
      .replace(':', '')
      .split('・')
      .map(i => i.trim());
  const url = `http://mp3-cdn2.luoo.net/low/chinese/${date.replace(/-/g, '')}.mp3`;
  const cover = handleSingleImgSrc(
    banner
      .querySelector("img.cover")
      .getAttribute("src")
      .trim()
  );
  const color = await getAverageColor(cover);
  return {
      id,
      name,
      artist,
      cover,
      desc,
      recommender,
      url,
      color
  } as Single;
}

async function launch() {
    const pageCount = await getPageCount();
    const singles = await getSinglesFromPage(pageCount);
    console.log(singles);
    // for (let i = pageCount; i > 0; i--) {
    //     const singles = await getSinglesFromPage(i);
    //     console.log(singles);
    // }
}


launch()
  .then(console.log)
  .catch(console.error);
