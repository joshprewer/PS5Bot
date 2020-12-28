import puppeteer from 'puppeteer'
import Site from './site';

export default async function checkSite(page: puppeteer.Page, site: Site): Promise<boolean> {
  const isAvailable = await site.isAvailable(page);

  if (isAvailable) {
    console.log('\x1b[32m%s\x1b[0m', `Attempting purchase at ${site.name}`)

    try {
      await site.attemptPurchase(page)
      console.log('\x1b[32m%s\x1b[0m', `Purchased PS5 at ${site.name}`)
      return true
    } catch {
      return false
    }
  } else {
    console.log('\x1b[31m%s\x1b[0m', `PS5 is unavailable at ${site.name}`)
    return false
  }
}