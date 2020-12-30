import puppeteer from 'puppeteer'
import Site from './sites/site';
import { sendSms } from './sendSms'

export default async function checkSite(page: puppeteer.Page, site: Site): Promise<boolean> {
  const isAvailable = await site.isAvailable(page);

  if (isAvailable) {
    const attemptMessage = `Attempting purchase at ${site.name}`
    console.log('\x1b[32m%s\x1b[0m', attemptMessage)
    sendSms(attemptMessage)

    try {
      await site.attemptPurchase(page)

      const purchasedMessage = `Purchased PS5 at ${site.name}`
      console.log('\x1b[32m%s\x1b[0m', purchasedMessage)
      sendSms(purchasedMessage)

      return true
    } catch(error) {
      console.log(error)
      const failedMessage = `Purchase failed at ${site.name}`
      sendSms(failedMessage)
      return false
    }
  }

  console.log('\x1b[31m%s\x1b[0m', `PS5 is unavailable at ${site.name}`)
  return false
}