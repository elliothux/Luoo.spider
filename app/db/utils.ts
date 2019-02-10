import {Db, MongoClient} from "mongodb";
import config from "../../config";

let DB: Db = null;
async function getDB(): Promise<Db> {
    if (DB) return DB;
    return new Promise<Db>((resolve, reject) => {
        const client = new MongoClient(config.DB_URL, { useNewUrlParser: true });
        client.connect(function(err) {
            if (err) return reject(err);
            const db: Db = client.db(config.DB_NAME);
            DB = db;
            resolve(db);
        });
    });
}

export {
    getDB
}
