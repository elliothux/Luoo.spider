const Koa = require('koa');
const Router = require('koa-router');
const db = require('./db');
const config = require('./package.json').config;


const [app, router] = [new Koa(), new Router()];


router.get('/vols/:preVol', async ctx => {
    ctx.body = JSON.stringify(await db.vol.getList(parseInt(ctx.params.preVol)))
});


router.get('/singles/:preDate', async ctx => {
    ctx.body = JSON.stringify(await db.single.getList(parseInt(ctx.params.preDate)))
});


router.get('/vol/:vol', async ctx => {
    const data = await db.vol.get(parseInt(ctx.params.vol));
    data && (data.tracks = await db.vol.tracks(parseInt(ctx.params.vol)));
    ctx.body = JSON.stringify(data || 'error')
});


router.get('/single/:date', async ctx => {
    const data = await db.single.get(parseInt(ctx.params.date));
    ctx.body = JSON.stringify(data || 'error')
});


router.get('/latest/:type', ctx => {
    const type = ctx.params.type;
    ctx.body = (type === 'vol' || type === 'single') ?
        db[type].latest() : -1
});


app.use(router.routes()).listen(config.port);
