import puppeteer from 'puppeteer'
import * as dotenv from 'dotenv'

const productUrl = 'https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452/';

async function isAvailable(page: puppeteer.Page): Promise<boolean> {
  const addToCartBtn = await page.evaluate(() => {
    return document.querySelector("input[id='add-to-cart-button']")
  })
  const isAvailable = addToCartBtn !== null
  return isAvailable
}

(async () => {
  dotenv.config()

  const browser = await puppeteer.launch({ args: ['--disable-features=site-per-process', '--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto(productUrl)

  const cookieButton = await page.waitForSelector("input[id='sp-cc-accept']")
  await cookieButton.click()

  var productLive = await isAvailable(page)
  while (!productLive) {
    console.log('sleep')
    await page.waitForTimeout(5 * 60 * 1000)
    await page.goto(productUrl)
    productLive = await isAvailable(page)
  }

  // Product Page
  console.log('product page live')

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
  await page.screenshot({ path: 'checkout.png', fullPage: true })

  const payBtn = await page.waitForSelector("input[title='Buy Now']")
  await payBtn.click()

  await page.screenshot({ path: 'confirmation.png', fullPage: true })
  await page.waitForTimeout(3 * 60 * 1000)

  await browser.close()
})()