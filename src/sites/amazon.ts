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
    const cookiesBtn = await page.waitForSelector('#sp-cc-accept')
    await cookiesBtn.click()

    const buyButton = await page.waitForSelector("input[id='add-to-cart-button']")
    await buyButton.click()

    if (page.url() === this.productUrl) {
      await page.waitForTimeout(3 * 1000)
      try {
        const noThanksBtn = await page.waitForSelector("button[id='attachSiNoCoverage-announce']", {timeout: 2000 })
        await noThanksBtn.click()
      } catch {}
    }

    await page.waitForTimeout(3 * 1000)
    const checkoutButton = await this.findCheckOutBtn(page)
    await checkoutButton.click()

    // Sign In
    const emailInput = await page.waitForSelector("input[type='email']")
    await emailInput.focus()
    await page.keyboard.type(process.env.AMAZON_EMAIL)

    const continueBtn = await page.waitForSelector("input[id='continue']")
    await continueBtn.click()

    const passwordInput = await page.waitForSelector("input[type='password']")
    await passwordInput.focus()
    await page.keyboard.type(process.env.AMAZON_PWD)

    const signInBtn = await page.waitForSelector("input[id='signInSubmit']")
    await signInBtn.click()

    await page.waitForTimeout(10 * 1000)
    await page.screenshot({ path: `screenshots/${this.name}/checkout.png`, fullPage: true })

    const payBtn = await page.waitForSelector("#placeYourOrder > span > input")
    await payBtn.click()

    await page.waitForTimeout(10 * 1000)

    await page.screenshot({ path: `screenshots/${this.name}/confirmation.png`, fullPage: true })
    await page.waitForTimeout(3 * 60 * 1000)
  }

  async findCheckOutBtn(page: puppeteer.Page): Promise<puppeteer.ElementHandle<Element>> {
    if (page.url().includes(this.productUrl)) {
      return await page.waitForSelector("#attach-sidesheet-checkout-button > span > input")
    } else {
      return await page.waitForSelector("a[id='hlb-ptc-btn-native']")
    }
  }
}