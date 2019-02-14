import { findBestMatch } from 'string-similarity';
import {requestData, requestJson} from "../../utils";
import {getVolCollection, VolInfo} from "../../db/vol";
import {isLyricExist, LrcType, saveLyric, VolTrackLrc} from "../../db/lyric";

interface Params {
  name: string;
  artist: string;
}

interface GecimiResponse {
    code: number,
    count: number,
    result: GecimiResultItem[]
}
interface GecimiResultItem {
    aid: number,
    artist_id: number,
    lrc: string,
    sid: number
    song: number
}
async function getLyricFromGecimi(params: Params): Promise<string | null> {
  const uri = `http://gecimi.com/api/lyric/${params.name}/${params.artist}`;
  const response = await requestJson<GecimiResponse>(uri);
  if (response.code !== 0) {
      return null;
  }
  if (response.result.length) {
      const [{ lrc }] = response.result;
      return requestData(lrc);
  }
  return null;
}

interface BzqllResponse<T> {
    result: string,
    code: number,
    data: T
}

interface NetEaseResultItem {
    id: string,
    name: string,
    singer: string,
    pic: string,
    lrc: string,
    url: string,
    time: number
}

type NetEaseResponse = BzqllResponse<NetEaseResultItem>;
async function getLyricFromNetEase(params: Params): Promise<string | null> {
    const { name, artist } = params;
    const uri = `https://api.bzqll.com/music/netease/search?key=579621905&s=${name}&type=song&limit=100&offset=0`;
    const response = await requestJson<NetEaseResponse>(uri);
    if (response.code !== 200) {
        return null;
    }
    if (Array.isArray(response.data)) {

    }
    return null;
}

function getLyric(info: Params): Promise<string | null> {
    return getLyricFromGecimi(info);
}

async function getVolTrackLyrics() {
    const collection = await getVolCollection();
    const vols = await collection.find({}).toArray() as VolInfo[];
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
                console.log(`Save vol lyric: ${name} - ${artist}`);
            }
        }
    }
}

async function launch() {
    await getVolTrackLyrics();
}

(async () => {
    const best = findBestMatch('healed', ['edward', 'sealed', 'theatre']);
    console.log(best);
})()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });


export {
    launch,
    getLyric
}
