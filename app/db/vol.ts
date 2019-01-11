
import { MongoClient, Db, Collection } from 'mongodb';
import config from '../../config';
import { Track } from './track';

interface VolTask {
    id: number,
    vol: number,
    title: string,
    link: string,
    done: boolean,
}

interface VolInfo {
    id: number,
    vol: number,
    title: string,
    link: string,
    cover: string,
    color: string,
    author: string,
    authorAvatar: string,
    date: string,
    desc: string,
    tags: string[],
    similarVols: number[],
    tracks: Track[]
}

let DB: Db = null;
async function getDB(): Promise<Db> {
    if (DB) return DB;
    return new Promise<Db>(((resolve, reject) => {
        const client = new MongoClient(config.DB_URL);
        client.connect(function(err) {
            if (err) return reject(err);
            const db: Db = client.db(config.DB_NAME);
            DB = db;
            resolve(db);
        });
    }))
}

async function getVolTaskCollection(): Promise<Collection> {
    const db = await getDB();
    return db.collection('tasks');
}
async function addVolTask(taskInfo: VolTask) {
    const collection = await getVolTaskCollection();
    return collection.insertOne(taskInfo);
}
async function doneVolTask(vol: number) {
    const collection = await getVolTaskCollection();
    return collection.updateOne(
        { vol },
        { $set: { done: true } }
    );
}
async function isVolTaskExist(id: number): Promise<boolean> {
    const collection = await getVolTaskCollection();
    const count = await collection.countDocuments({ id });
    return count > 0;
}

async function getOneUnfinishedTask(): Promise<VolTask> {
    const collection = await getVolTaskCollection();
    return collection.findOne<VolTask>({ done: false });
}

export {
    VolInfo,
    VolTask,
    addVolTask,
    doneVolTask,
    isVolTaskExist,
    getOneUnfinishedTask
}
