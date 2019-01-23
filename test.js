
const files = [
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/b115d1568bf7214d7f6709fe8052d1e9.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/341560721f692f1da291e1a606cd65a7.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/ab577b7524d1cdbdfba7eac37d4bf31b.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/97f68a0ff53513bb73becf0ed601dbbe.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/b059d658255f478498324e9b80a3e354.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/e217c3cebeea0869857955a2a462ad85.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/34d8f3992f63b5ef28112962f95080c7.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/62d877ba2a36785339408903473b3ba8.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/045e127b1a024bf347788120dc206f63.jpg",
  "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/553a47aaba90fed211187da86bd485c9.jpg",
  // "/Users/qingyang/Desktop/Proj/Luoo.Spider/temp/db65153752f82b2c0a6db8c3f99715e2.jpg"
];

const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.
  await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'hn.pdf', format: 'A4'});

  await browser.close();
})();
