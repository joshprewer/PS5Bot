import puppeteer from 'puppeteer'
import Site from './site'
import fs from 'fs'

export default class Amazon implements Site {
  name: string = 'Amazon'
  productUrl: string = 'https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452/'

  constructor() {
    fs.mkdirSync(`screenshots/${this.name}`, {recursive: true})
  }

  async isAvailable(page: puppeteer.Page): Promise<boolean> {
    await page.goto(this.productUrl)
    const addToCartBtn = await page.evaluate(() => {
      return document.querySelector("input[id='add-to-cart-button']")
    })
    const isAvailable = addToCartBtn !== null
    return isAvailable
  }

  async attemptPurchase(page: puppeteer.Page): Promise<void> {
    await attemptPurchase(page)
  }
}

async function attemptPurchase(page: puppeteer.Page) {
  const buyButton = await page.waitForSelector("input[id='add-to-cart-button']")
  await buyButton.click()

  await page.waitForTimeout(2 * 1000)

  const checkoutButton = await page.waitForSelector("span[id='attach-sidesheet-checkout-button']")
  await checkoutButton.click()

  // Sign In
  const emailInput = await page.waitForSelector("input[type='email']")
  await emailInput.focus()
  await page.keyboard.type(process.env.EMAIL)

  const continueBtn = await page.waitForSelector("input[id='continue']")
  await continueBtn.click()

  const passwordInput = await page.waitForSelector("input[type='password']")
  await passwordInput.focus()
  await page.keyboard.type(process.env.AMAZON_PWD)

  const signInBtn = await page.waitForSelector("input[id='signInSubmit']")
  await signInBtn.click()

  await page.waitForTimeout(5 * 1000)
  await page.screenshot({ path: `screenshots/${Amazon.name}/checkout.png`, fullPage: true })

  const payBtn = await page.waitForSelector("input[title='Buy Now']")
  await payBtn.click()

  await page.screenshot({ path: `screenshots/${Amazon.name}/confirmation.png`, fullPage: true })
  await page.waitForTimeout(3 * 60 * 1000)
}