import * as R from "ramda";
import {
  requestHTMLDOM,
  getVolIdFromURL,
  getAverageColor,
  handleVolImgSrc,
  sleep,
  handleSingleImgSrc,
  formatDesc
} from "../../utils";
import { isSingleExist, saveSingle, Single } from "../../db/single";

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
  const bannerSingle: Single = await getBannerSingle(doc);
  const otherSingles: Single[] = await getOtherSingles(doc);
  return [bannerSingle, ...otherSingles].reverse();
}

async function getBannerSingle(doc: Document): Promise<Single> {
  const banner = doc.querySelector(".musician-banner");
  const meta = banner.querySelector("div.meta") as HTMLElement;
  const { id, name, artist, desc, recommender, date, url } = getInfoFromMeta(
    meta
  );
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
    date,
    recommender,
    url,
    color
  } as Single;
}

async function getOtherSingles(doc: Document): Promise<Single[]> {
  const singles: Single[] = [];
  debugger;
  const nodes = Array.from(
    doc.querySelectorAll(".musician-list > .item")
  ) as HTMLElement[];
  for (let e of nodes) {
    singles.push(await getSingleFromElement(e));
  }
  return singles;
}

async function getSingleFromElement(element: HTMLElement): Promise<Single> {
  const meta = element.querySelector(".musician-wrapper") as HTMLElement;
  const { id, name, artist, desc, recommender, date, url } = getInfoFromMeta(
    meta
  );
  const cover = handleSingleImgSrc(
    element
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
    date,
    recommender,
    url,
    color
  } as Single;
}

interface MetaInfo {
  id: number;
  name: string;
  artist: string;
  desc: string;
  recommender: string;
  date: string;
  url: string;
}

function getInfoFromMeta(meta: HTMLElement): MetaInfo {
  const id = parseInt(meta.querySelector("a.title").getAttribute("data-id"));
  const name = meta.querySelector("a.title").childNodes[0].nodeValue.trim();
  const artist = meta.querySelector("p.performer").innerHTML.trim();
  const desc = formatDesc(meta.querySelector("p.remark").innerHTML);
  const remarkInfo = meta.querySelector("p.date").innerHTML.trim();
  const [recommender, date] = remarkInfo
    .replace("推荐人", "")
    .replace("：", "")
    .replace(":", "")
    .split("・")
    .map(i => i.trim());
  const url = `http://mp3-cdn2.luoo.net/low/chinese/${date.replace(
    /-/g,
    ""
  )}.mp3`;
  return {
    id,
    name,
    artist,
    desc,
    recommender,
    date,
    url
  } as MetaInfo;
}

async function launch() {
  const pageCount = await getPageCount();
  for (let i = 1; i <= pageCount; i++) {
    console.log(`Get singles of page ${i}, total ${pageCount}.`);
    let singles;
    try {
      singles = await getSinglesFromPage(i);
    } catch (e) {
      console.error(`Get singles of page ${i} failed: `, e);
      throw e;
    }
    for (let single of singles) {
      if (await isSingleExist(single.date)) {
        return console.log("Single exist. Task Done.");
      }
      await saveSingle(single);
      console.log(`Save single ${single.name} of page ${i}.`);
    }
    await sleep(Math.min(2, Math.random() * 6) * 1000);
  }
}

launch()
  .then((...args: any[]) => {
    console.log(...args);
    process.exit(0);
  })
  .catch((...args: any[]) => {
    console.error(...args);
    process.exit(0);
  });
