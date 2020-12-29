import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import Game from './sites/game'
import Amazon from './sites/amazon'
import Site from './sites/site'
import checkSite from './checkSite'

const TIMEOUT = 2 * 60 * 1000

const sites: Site[] = [
  new Amazon(),
  new Game()
]

function sleep (timer: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), timer))
}

async function main () {
  dotenv.config()
  const browser = await puppeteer.launch({args: ['--disable-features=site-per-process', '--no-sandbox'] })
  const pages = await Promise.all(sites.map(async (site) => {
    const page = await browser.newPage()
    return {
      site,
      page
    }
  }))


  while (true) {
    const results = await Promise.all(pages.map(element=>checkSite(element.page, element.site)))

    if (results.filter(element=>element).length !== 0) {
      break
    }

    console.log('------------- SLEEPING -------------')
    await sleep(TIMEOUT)
  }
}

main()