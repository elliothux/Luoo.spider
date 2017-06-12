const db = require('mongodb').MongoClient;
const path = require('path');
// const fs = require('node-fs-extra');
const config = require(path.join(__dirname, '../package.json')).config;


let vol, track;
db.connect('mongodb://localhost:27017/luoo', function (error, db) {
    if (error) throw new Error(error);
    vol = db.collection('vol');
    track = db.collection('track');
});


function getLatestVol() {
    return new Promise((resolve, reject) => {
        let retryTimes = 0;
        let timer;
        if (!vol)
            timer = setInterval(function () {
                if (retryTimes > config.maxRetryTimes)
                    return reject('Database not available now.');
                console.log('Waiting for database. Retry 200ms later.');
                if (vol) {
                    vol.find({}).toArray((error, doc) =>
                        resolve(doc.length + config.disappearVols.length)
                    );
                    clearInterval(timer);
                }
            }, 200);
        else vol.find({}).toArray((error, doc) =>
            resolve(doc.length + config.disappearVols.length)
        )
    })
}


getLatestVol().then(a => console.log(a)).catch(e => console.error(e));