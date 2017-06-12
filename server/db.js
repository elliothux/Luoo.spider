const db = require('mongodb').MongoClient;
const config = require('./package.json').config;


module.exports = {
    vol: {
        latest: getLatestVol,
        get: getVol,
        getList: getVolList,
        tracks: getTracks
    },
    single: {
        latest: getLatestSingle,
        get: getSingle,
        getList: getSingleList
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
        vol.find({vol: parseInt(volNum)}).toArray((error, doc) => {
            if (error) reject(error);
            resolve(doc.length > 0 ? doc[0] : false)
        })
    }
}


function getVolList(preVol) {
    return new Promise((resolve, reject) => {
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
        vol.find({vol: { $gt: parseInt(preVol), $lt: getLatestVol() + 1 }})
            .toArray(async (error, doc) => {
                if (error) reject(error);
                for (let i=preVol+1, j=0; j<doc.length; i++, j++)
                    doc[j].tracks = await getTracks(i)
                resolve(doc)
        })
    }
}


function getSingle(date) {
    return new Promise((resolve, reject) => {
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
        single.find({date: parseInt(date)}).toArray((error, doc) => {
            if (error) reject(error);
            resolve(doc.length > 0 ? doc[0] : false)
        })
    }
}


function getSingleList(preDate) {
    return new Promise((resolve, reject) => {
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
        single.find({date: { $gt: parseInt(preDate), $lt: getLatestSingle() + 1 }})
            .toArray(async (error, doc) => {
                if (error) reject(error);
                resolve(doc)
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
