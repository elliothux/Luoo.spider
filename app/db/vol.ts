
import { MongoClient, Db, Collection } from 'mongodb';
import config from '../../config';

interface VolTask {
    vol: number,
    title: string,
    link: string,
    done: boolean,
}

interface VolInfo {
    vol: number,
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
async function addVolTask(taskInfo: VolInfo) {
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
async function isVolTaskExist(vol: number): Promise<boolean> {
    const collection = await getVolTaskCollection();
    const count = await collection.countDocuments({ vol });
    return count > 0;
}

export {
    VolInfo,
    VolTask,
    addVolTask,
    doneVolTask,
    isVolTaskExist
}