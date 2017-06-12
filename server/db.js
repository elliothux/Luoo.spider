const db = require('mongodb').MongoClient;
const config = require('./package.json').config;


module.exports = {
    vol: {
        latest: getLatestVol,
        get: getVol,
        tracks: getTracks
    },
    single: {
        latest: getLatestSingle,
        get: getSingle
    }
};


let vol, track, single;
db.connect('mongodb://localhost:27017/luoo', function (error, db) {
    if (error) throw new Error(error);
    vol = db.collection('vol');
    track = db.collection('track');
    single = db.collection('single');
});


function getVol(volNum) {
    return new Promise((resolve, reject) => {
        if (config.disappearVols.includes(vol))
            return false;
        let retryTimes = 0;
        let timer;
        if (!vol)
            timer = setInterval(function () {
                if (retryTimes > config.maxRetryTimes)
                    return reject('Database not available now.');
                console.log('Waiting for database. Retry 200ms later.');
                if (vol) {
                    exec(resolve, reject);
                    clearInterval(timer);
                }
            }, 200);
        else exec(resolve, reject)
    });

    function exec(resolve, reject) {
        vol.find({vol: volNum}).toArray((error, doc) => {
            if (error) reject(error);
            resolve(doc.length > 0 ? doc[0] : false)
        })
    }
}


function getSingle(date) {
    return new Promise((resolve, reject) => {
        if (config.disappearVols.includes(vol))
            return false;
        let retryTimes = 0;
        let timer;
        if (!single)
            timer = setInterval(function () {
                if (retryTimes > config.maxRetryTimes)
                    return reject('Database not available now.');
                console.log('Waiting for database. Retry 200ms later.');
                if (single) {
                    exec(resolve, reject);
                    clearInterval(timer);
                }
            }, 200);
        else exec(resolve, reject)
    });

    function exec(resolve, reject) {
        single.find({date: date}).toArray((error, doc) => {
            if (error) reject(error);
            resolve(doc[0])
        })
    }
}


function getTracks(volNum) {
    return new Promise((resolve, reject) => {
        if (config.disappearVols.includes(vol))
            return [];
        let retryTimes = 0;
        let timer;
        if (!track)
            timer = setInterval(function () {
                if (retryTimes > config.maxRetryTimes)
                    return reject('Database not available now.');
                console.log('Waiting for database. Retry 200ms later.');
                if (track) {
                    exec(resolve, reject);
                    clearInterval(timer);
                }
            }, 200);
        else exec(resolve, reject)
    });

    function exec(resolve, reject) {
        track.find({vol: volNum}).toArray((error, doc) => {
            if (error) reject(error);
            resolve(doc)
        })
    }
}


function getLatestVol() {
    return config.latestVol
}


function getLatestSingle() {
    return config.latestSingle
}
