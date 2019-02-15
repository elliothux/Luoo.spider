import { compareTwoStrings } from "string-similarity";
import { requestData, requestJson, sleep } from "../../utils";
import { getVolCollection, VolInfo } from "../../db/vol";
import {
  ArticleTrackLrc,
  isLyricExist,
  LrcType,
  saveLyric,
  SingleLrc,
  VolTrackLrc
} from "../../db/lyric";
import { Article, getArticleCollection } from "../../db/article";
import { getSingleCollection, Single } from "../../db/single";


interface Params {
  name: string;
  artist: string;
}

interface GecimiResponse {
  code: number;
  count: number;
  result: GecimiResultItem[];
}

interface GecimiResultItem {
  aid: number;
  artist_id: number;
  lrc: string;
  sid: number;
  song: number;
}

async function getLyricFromGecimi(params: Params): Promise<string | null> {
  const uri = `http://gecimi.com/api/lyric/${params.name}/${params.artist}`;
  const response = await requestJson<GecimiResponse>(uri);
  if (response.code !== 0 || !response.result.length) {
    return null;
  }
  const [{ lrc }] = response.result;
  return requestData(lrc);
}


interface BzqllResponse<T> {
  result: string;
  code: number;
  data: T;
}

interface NetEaseResultItem {
  id: string;
  name: string;
  singer: string;
  pic: string;
  lrc: string;
  url: string;
  time: number;
}

type NetEaseResponse = BzqllResponse<NetEaseResultItem[]>;

async function getLyricFromNetEase(params: Params): Promise<string | null> {
  const { name, artist } = params;
  const uri = `https://api.bzqll.com/music/netease/search?key=579621905&s=${name}&type=song&limit=100&offset=0`;

  const response = await requestJson<NetEaseResponse>(uri);
  if (response.code !== 200 || !response.data.length) {
    return null;
  }

  const bestMatchIndex = response.data
    .map((i, index) => {
      const { name: resultName, singer: resultArtist } = i;
      return {
        match:
          compareTwoStrings(name, resultName) *
          compareTwoStrings(artist, resultArtist),
        index
      };
    })
    .sort((i, j) => j.match - i.match)[0].index;
  const bestMatch = response.data[bestMatchIndex];
  return requestData(bestMatch.lrc);
}

function isLrcValid(lrc: string): boolean {
  return !/暂无歌词/.test(lrc);
}

async function getLyric(info: Params): Promise<string | null> {
  const methods = [getLyricFromNetEase, getLyricFromGecimi];

  let lrc = null;

  for (let m of methods) {
    if (lrc) {
      return lrc;
    }

    try {
      const response = await m(info);
      if (response && isLrcValid(response)) {
        lrc = response;
      }
    } catch (e) {
      console.error("error: ", e);
    }
  }

  return lrc;
}

async function getVolTrackLyrics() {
  const collection = await getVolCollection();
  const vols = (await collection.find({}).toArray()) as VolInfo[];
  for (let vol of vols) {
    const { tracks, id: volId } = vol;
    for (let track of tracks) {
      const { name, artist, album, id } = track;
      if (await isLyricExist(id, LrcType.VolTrackLrc)) {
        continue;
      }
      console.log(`Getting vol lyric: ${name} - ${artist}`);
      const lyric = await getLyric({ name, artist });
      if (lyric) {
        const lrc = {
          id,
          volId,
          name,
          artist,
          album,
          lyric,
          type: LrcType.VolTrackLrc
        } as VolTrackLrc;
        await saveLyric(lrc);
        console.log(`Save vol track lyric: ${name} - ${artist}`);
        await sleep(3000);
      } else {
        console.error(`Failed to get vol track lyric: ${name} - ${artist}`);
      }
    }
  }
}

async function getArticleTrackLyrics() {
  const collection = await getArticleCollection();
  const articles = (await collection.find({}).toArray()) as Article[];
  for (let article of articles) {
    const { id: articleId, tracks } = article;
    for (let track of tracks) {
      const { name, artist, album, id } = track;
      if (await isLyricExist(id, LrcType.ArticleTrackLrc)) {
        continue;
      }
      console.log(`Getting article track lyric: ${name} - ${artist}`);
      const lyric = await getLyric({ name, artist });
      if (lyric) {
        const lrc = {
          id,
          articleId,
          name,
          artist,
          album,
          lyric,
          type: LrcType.ArticleTrackLrc
        } as ArticleTrackLrc;
        await saveLyric(lrc);
        console.log(`Save article track lyric: ${name} - ${artist}`);
        await sleep(3000);
      } else {
        console.error(`Failed to get article track lyric: ${name} - ${artist}`);
      }
    }
  }
}

async function getSingleLyrics() {
  const collection = await getSingleCollection();
  const singles = (await collection.find({}).toArray()) as Single[];
  for (let single of singles) {
    const { name, artist, id, date } = single;
    if (await isLyricExist(id, LrcType.SingleLrc)) {
      continue;
    }
    console.log(`Getting single lyric: ${name} - ${artist}`);
    const lyric = await getLyric({ name, artist });
    if (lyric) {
      const lrc = {
        id,
        date,
        name,
        artist,
        lyric,
        type: LrcType.SingleLrc
      } as SingleLrc;
      await saveLyric(lrc);
      console.log(`Save single lyric: ${name} - ${artist}`);
      await sleep(3000);
    } else {
      console.error(`Failed to get single lyric: ${name} - ${artist}`);
    }
  }
}

async function launch() {
  await getVolTrackLyrics();
  await getArticleTrackLyrics();
  await getSingleLyrics();
}

(async () => {
  await launch();
})()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

export { launch, getLyric };
