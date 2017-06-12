const Koa = require('koa');
const Router = require('koa-router');
const db = require('./db');
const config = require('./package.json').config;


const [app, router] = [new Koa(), new Router()];


router.get('/vol/:preVol', async (ctx, next) => {
    const data = [];
    for (let i=parseInt(ctx.params.preVol)+1; i<=db.vol.latest(); i++) {
        const vol = await db.vol.get(i);
        if (vol) {
            vol.tracks = await db.vol.tracks(i);
            data.push(vol)
        }
    }
    ctx.body = JSON.stringify(data)
});


router.get('/single/:preSingle', async (ctx, next) => {
    // const data = [];
    // for (let i=parseInt(ctx.params))
});


app.use(router.routes()).listen(config.port);
