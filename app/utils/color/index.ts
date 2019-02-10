import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import { sleep } from "../index";

declare global {
  function getAverageRGBFromBase64(filePath: string): Promise<RGBValue>;
}

type RGBValue = {
  r: number;
  g: number;
  b: number;
};

let isInitialing: boolean = false;
let browser: puppeteer.Browser;
let page: puppeteer.Page;

async function init() {
  isInitialing = true;
  const b = await puppeteer.launch();
  const p = await b.newPage();
  const htmlPath = path.join(__dirname, "./index.html");
  await p.goto(`file://${htmlPath}`, { waitUntil: "networkidle2" });
  browser = b;
  page = p;
  isInitialing = false;
}

async function getAverageColor(filePath: string): Promise<string> {
  if (!browser) {
    if (!isInitialing) {
      await init();
    } else {
      while (isInitialing) {
        await sleep(500);
      }
    }
  }

  const imgBase64Str = base64Encode(filePath);
  const result = await page.evaluateHandle(imgStr => {
    return getAverageRGBFromBase64(imgStr);
  }, imgBase64Str);
  const { r, g, b } = await result.jsonValue();
  return rgbToHex(r, g, b);

  function rgbToHex(r: number, g: number, b: number): string {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
}

async function close() {
  if (!browser) {
    return;
  }
  await browser.close();
  browser = null;
  page = null;
}

function base64Encode(filePath: string): string {
  const bitmap = fs.readFileSync(filePath);
  return new Buffer(bitmap).toString("base64");
}

export { getAverageColor, close };
