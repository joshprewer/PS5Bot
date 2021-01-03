import puppeteer from "puppeteer";
import dotenv from "dotenv";
import Game from "./sites/game";
import Amazon from "./sites/amazon";
import Currys from "./sites/currys";
import Smyths from "./sites/smyths";
import {Site} from "./sites/site";
import checkSite from "./checkSite";

const TIMEOUT = 45 * 1000;

const sites: Site[] = [new Currys(), new Amazon(), new Game(), new Smyths()];

function sleep(timer: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), timer));
}

async function main() {
  dotenv.config();
  const browser = await puppeteer.launch({
    args: [
      "--disable-features=site-per-process",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    defaultViewport: {
      width: 1680,
      height: 1050,
    },
  });

 const page = await browser.newPage()

  while (true) {
    try {
      for (const site of sites) {
        const success = await checkSite(page, site)
        if (success) {
          await browser.close();
          process.abort()
        }
      }

      console.log("------------- SLEEPING -------------");
      await sleep(TIMEOUT);
    } catch (error) {
      console.log(error);
      await browser.close();

      process.abort();
    }
  }
}

main();
