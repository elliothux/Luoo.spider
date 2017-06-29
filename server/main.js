const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const db = require('./db');
const config = () => require('./package.json');


const [app, router] = [new Koa(), new Router()];


router.get('/vols/:preVol', async ctx => {
    ctx.body = JSON.stringify(await db.vol.getList(parseInt(ctx.params.preVol)));
    log(`/vols/${ctx.params.preVol}`, ctx.request.ip)
});


router.get('/singles/:preDate', async ctx => {
    ctx.body = JSON.stringify(await db.single.getList(parseInt(ctx.params.preDate)));
    log(`/singles/${ctx.params.preDate}`, ctx.request.ip)
});


router.get('/vol/:vol', async ctx => {
    const data = await db.vol.get(parseInt(ctx.params.vol));
    data && (data.tracks = await db.vol.tracks(parseInt(ctx.params.vol)));
    ctx.body = JSON.stringify(data || 'error');
    log(`/vol/${ctx.params.Vol}`, ctx.request.ip)
});


router.get('/single/:date', async ctx => {
    const data = await db.single.get(parseInt(ctx.params.date));
    ctx.body = JSON.stringify(data || 'error');
    log(`/single/${ctx.params.date}`, ctx.request.ip)
});


router.get('/latest/:type', ctx => {
    const type = ctx.params.type;
    ctx.body = (type === 'vol' || type === 'single') ?
        db[type].latest() : -1;
    log(`/latest/${ctx.params.type}`, ctx.request.ip)
});


router.get('/download/:platform', ctx => {
    const platform = parseInt(ctx.params.platform);
    const URL = `http://os3s219a3.bkt.clouddn.com/Luoo.qy-v${config().update.mainVersion}.0.${['dmg', 'exe', 'zip'][platform]}`;
    ctx.redirect(URL);
    log(`/download/${ctx.params.platform}`, ctx.request.ip)
});


router.get('/update/:platform/:preVersion', ctx => {
    const info = config().update;
    const preVersion = ctx.params.preVersion.split('.');

    if (parseInt(preVersion[0]) === info.mainVersion && parseInt(preVersion[1]) === info.updateVersion)
        ctx.body = JSON.stringify({ type: 'none' });

    else if (parseInt(preVersion[0]) !== info.mainVersion)
        ctx.body = JSON.stringify({
            type: 'full',
            version: `${info.mainVersion}.0`,
            url: `http://os3s219a3.bkt.clouddn.com/Luoo.qy-v${info.mainVersion}.0.${['dmg', 'exe', 'zip'][parseInt(ctx.params.platform)]}`,
            desc: info.mainDesc
        });

    else ctx.body = JSON.stringify({
            type: info.type,
            version: `${info.mainVersion}.${info.updateVersion}`,
            url: `http://os3s219a3.bkt.clouddn.com/update-v${info.mainVersion}.${info.updateVersion}.zip`,
            desc: info.updateDesc
        });
    log(`/update/${ctx.params.platform}/${ctx.params.preVersion}`, ctx.request.ip)
});


app.use(router.routes()).listen(config().config.port);
app.use(require('koa-static-server')({
    rootDir: path.join(__dirname, '../website'),
    index: 'index.html'
}));


function log(api, ip) {
    ip = ip.split(':')[3];
    console.log(`Response api  ${api.red}  to  ${ip.yellow}  at  ${(new Date()).toLocaleString().green}`)
}
