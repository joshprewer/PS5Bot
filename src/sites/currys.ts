import puppeteer from 'puppeteer'
import { Site, clickButton, fillForm } from './site'
import fs from 'fs'

export default class Currys implements Site {
  name: string = 'Currys'
  productUrl: string = 'https://www.currys.co.uk/gbuk/gaming/console-gaming/consoles/sony-playstation-5-825-gb-10203370-pdt.html'
  redirectUrl: string = 'https://www.currys.co.uk/gbuk/gaming/console-gaming/consoles/634_4783_32541_xx_xx/xx-criteria.html'

  constructor() {
    fs.mkdirSync(`screenshots/${this.name}`, {recursive: true})
  }

  async isAvailable(page: puppeteer.Page): Promise<boolean> {
    await page.goto(this.productUrl, {
      waitUntil: 'load',
      timeout: 0
    })
    const cookieId = "button[id='onetrust-accept-btn-handler']"
    try {
      await clickButton(cookieId, page)
    } catch {}

    await page.screenshot({ path: `screenshots/${this.name}/productPage.png`, fullPage: true })
    return page.url() !== this.redirectUrl
  }

  async attemptPurchase(page: puppeteer.Page): Promise<void> {
    try {
      const addBasketId = '#product-actions > div.channels.space-b > div.space-b.center > button'
      await clickButton(addBasketId, page)

      const continueBasketId = 'button[data-interaction="Continue to basket"]'
      await clickButton(continueBasketId, page)
    } catch {}

    await page.waitForTimeout(5000)

    const btn = await page.waitForXPath('//*[@id="root"]/div/div[2]/div/div/div/div[3]/div/div/div[2]/div/button')
    await btn.click()

    const postCodeId = '#delivery_location > input[type=search]'
    await fillForm(postCodeId, process.env.POSTCODE, page)

    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter");

    const deliverId = '#root > div > div.sc-gJqsIT.iTsLNm > div:nth-child(2) > div > div > div:nth-child(2) > div.Steps__StepContent-jhhwtd.dzahQb > div.sc-gVyKpa.hSBGqD > div.sc-gPzReC.jUjPjS > div.sc-cpmKsF.jjAJsv > div > div:nth-child(3) > div:nth-child(1) > button'
    await clickButton(deliverId, page)

    const emailId = 'input[data-di-field-id="email"]'
    await fillForm(emailId, process.env.EMAIL, page)
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter");

    const titleId = 'input[name="d-title"]'
    await clickButton(titleId, page)

    const mrId = 'div[data-qa="d-title_mr"]'
    await clickButton(mrId, page)

    await page.keyboard.press("Tab");
    await page.keyboard.type(process.env.FIRST_NAME);

    await page.keyboard.press("Tab");
    await page.keyboard.type(process.env.LAST_NAME);

    await page.keyboard.press("Tab");
    await page.keyboard.type(process.env.PHONE_NUMBER);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.type(process.env.ADDRESS_LINE_1);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.type(process.env.TOWN);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    const cardId = 'div[data-component="CardPayment"]'
    await clickButton(cardId, page)

    const cardNumberId = 'input[id="cardNumber"]'
    await fillForm(cardNumberId, process.env.CARD_NUMBER, page)

    await page.keyboard.press("Tab")
    await page.keyboard.type(process.env.CARD_NAME)

    await page.keyboard.press("Tab");
    await page.keyboard.type(process.env.CARD_EXPIRY)
    await page.keyboard.type(process.env.CARD_CVV)

    await page.screenshot({ path: `screenshots/${this.name}/checkout.png`, fullPage: true })

    await page.keyboard.press("Enter");
    await page.waitForTimeout(10 * 60 * 1000)

    await page.screenshot({ path: `screenshots/${this.name}/confirmation.png`, fullPage: true })
  }
}