import puppeteer from 'puppeteer'
import { Site } from './sites/site';
import { sendSms } from './sendSms'
import { Config } from './config';

export default async function checkSite(page: puppeteer.Page, site: Site, config: Config): Promise<boolean> {
  const isAvailable = await site.isAvailable(page);

  if (isAvailable) {
    const attemptMessage = `Attempting purchase at ${site.name}`
    console.log('\x1b[32m%s\x1b[0m', attemptMessage)
    sendSms(attemptMessage, config.smsConfig)

    try {
      await site.attemptPurchase(page, config)

      const purchasedMessage = `Purchased PS5 at ${site.name}`
      console.log('\x1b[32m%s\x1b[0m', purchasedMessage)
      sendSms(purchasedMessage, config.smsConfig)

      return true
    } catch(error) {
      console.log(error)
      const failedMessage = `Purchase failed at ${site.name}`
      sendSms(failedMessage, config.smsConfig)
      return false
    }
  }

  console.log('\x1b[31m%s\x1b[0m', `PS5 is unavailable at ${site.name}`)
  return false
}