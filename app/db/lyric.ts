import {Collection} from "mongodb";
import {getDB} from "./utils";

enum LrcType {
    VolTrackLrc,
    SingleLrc,
    ArticleTrackLrc
}

interface BaseLrc {
    name: string;
    artist: string;
    album?: string;
    lyric: string;
    type: LrcType
}

interface VolTrackLrc extends BaseLrc {
    id: number,
    volId: number,
}

interface SingleLrc extends BaseLrc {
    id: number,
    date: number
}

interface ArticleTrackLrc extends BaseLrc {
    id: number,
    articleId: number
}

type Lrc = VolTrackLrc | SingleLrc | ArticleTrackLrc;

async function getLrcCollection(): Promise<Collection> {
    const db = await getDB();
    return db.collection("lyrics");
}

async function isLyricExist(id: number, type: LrcType) {
    const collection = await getLrcCollection();
    const count = await collection.countDocuments({ type, id });
    return count > 0;
}

async function saveLyric(lrc: Lrc) {
    const collection = await getLrcCollection();
    return collection.insertOne(lrc);
}


export {
    LrcType,
    VolTrackLrc,
    SingleLrc,
    ArticleTrackLrc,
    isLyricExist,
    saveLyric
}
