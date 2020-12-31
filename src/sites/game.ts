import puppeteer from 'puppeteer'
import Site from './site'
import fs from 'fs'

export default class Game implements Site {
  name: string = 'Game'
  productUrl:string = 'https://www.game.co.uk/en/m/playstation-5-console-2826338';

  constructor() {
    fs.mkdirSync(`screenshots/${this.name}`, {recursive: true})
  }

  async isAvailable(page: puppeteer.Page): Promise<boolean> {
    await page.goto(this.productUrl)
    await page.screenshot({ path: `screenshots/${this.name}/productPage.png`, fullPage: true })
    return page.url() === this.productUrl
  }

  async attemptPurchase(page: puppeteer.Page): Promise<void> {
    await attemptPurchase(page)
  }
}

async function attemptPurchase(page: puppeteer.Page) {
  const cookeAcceptId = 'cookiePolicy_inner-link accept'
  const cookieButton = await page.waitForSelector(`a[class='${cookeAcceptId}']`)

  await cookieButton.click()

  const ps5BundleURL = 'addToBasket'
  const buyButton = await page.waitForSelector(`a[class='${ps5BundleURL}']`)

  await buyButton.click()

  const checkoutId = 'secure-checkout'
  const checkoutButton = await page.waitForSelector(`a[class='${checkoutId}']`)

  await checkoutButton.click()

  const ctaId = 'cta-large'
  const beingCheckoutBtn = await page.waitForSelector(`a[class='${ctaId}']`)

  await beingCheckoutBtn.click()

  const guestCheckoutId = "a[data-test='contact-link']"
  const guestCheckoutBtn = await page.waitForSelector(guestCheckoutId)

  await guestCheckoutBtn.click()

  // Contact Details
  const titleId = 'mat-select-trigger'
  const titleBtn = await page.waitForSelector(`div[class='${titleId}']`)

  await titleBtn.click()

  const mrId = 'mat-option-0'
  const mrBtn = await page.waitForSelector(`mat-option[id='${mrId}']`)

  await mrBtn.click()

  const nameId = 'mat-input-0'
  const nameForm = await page.waitForSelector(`input[id='${nameId}']`)

  await nameForm.focus()
  await page.keyboard.type(process.env.FIRST_NAME)

  const lastNameId = 'mat-input-1'
  const lastNameForm = await page.waitForSelector(`input[id='${lastNameId}']`)

  await lastNameForm.focus()
  await page.keyboard.type(process.env.LAST_NAME)

  const emailId = 'mat-input-2'
  const emailForm = await page.waitForSelector(`input[id='${emailId}']`)

  await emailForm.focus()
  await page.keyboard.type(process.env.EMAIL)

  const phoneId = 'mat-input-3'
  const phoneForm = await page.waitForSelector(`input[id='${phoneId}']`)

  await phoneForm.focus()
  await page.keyboard.type(process.env.PHONE_NUMBER)

  const saveId = 'submit'
  const saveBtn = await page.waitForSelector(`button[type='${saveId}']`)

  await saveBtn.click()

  // Delivery Details
  const manualId = 'manual-address-link'
  const manualBtn = await page.waitForSelector(`a[data-test='${manualId}']`)

  await manualBtn.click()

  const countrySelectId = "mat-form-field[data-test='country-input']"
  const countrySelectBtn = await page.waitForSelector(countrySelectId)

  await countrySelectBtn.click()

  const ukId = "mat-option[id='mat-option-6']"
  const ukBtn = await page.waitForSelector(ukId)

  await ukBtn.click()

  const addresLine1Id = "input[data-test='address-line-1']"
  const addresLine1IdInput = await page.waitForSelector(addresLine1Id)

  await addresLine1IdInput.focus()
  await page.keyboard.type(process.env.ADDRESS_LINE_1)

  const townId = "input[data-test='town']"
  const townInput = await page.waitForSelector(townId)

  await townInput.focus()
  await page.keyboard.type(process.env.TOWN)

  const postcodeId = "input[data-test='post-code']"
  const postcodeInput = await page.waitForSelector(postcodeId)

  await postcodeInput.focus()
  await page.keyboard.type(process.env.POSTCODE)

  const continueId = "button[data-test='continue-button']"
  const continueBtn = await page.waitForSelector(continueId)

  await continueBtn.click()

  // Delivery Method
  const continuePaymentId = "button[data-test='continue-to-payment']"
  const continuePaymentBtn = await page.waitForSelector(continuePaymentId)

  await continuePaymentBtn.click()

  // Payment Options
  await page.waitForTimeout(2000)
  await page.frames()

  for (const frame of page.mainFrame().childFrames()) {
    const url = frame.url()

    if (url.includes('cybersource')) {
      const cardNumberInput = await frame.$("input[name='credit-card-number']")
      await cardNumberInput.focus()
      await page.keyboard.type(process.env.CARD_NUMBER)

      const cardNameId = "input[formcontrolname='name']"
      const cardNameInput = await page.waitForSelector(cardNameId)

      await cardNameInput.focus()
      await page.keyboard.type(process.env.CARD_NAME)

      const cardExpiryId = "input[formcontrolname='expiryDate']"
      const cardExpiryInput = await page.waitForSelector(cardExpiryId)

      await cardExpiryInput.focus()
      await page.keyboard.type(process.env.CARD_EXPIRY)

      const cardCVVId = "input[formcontrolname='cvv']"
      const cardCVVInput = await page.waitForSelector(cardCVVId)

      await cardCVVInput.focus()
      await page.keyboard.type(process.env.CARD_CVV)

      const confirmCardId = "button[data-test='confirm-card']"
      const confirmCardBtn = await page.waitForSelector(confirmCardId)

      await confirmCardBtn.click()
    }
  }

  await page.waitForTimeout(5000)

  await page.screenshot({ path: `screenshots/${Game.name}/checkout.png`, fullPage: true })

  const payId = "button[data-test='pay-now']"
  const payBtn = await page.waitForSelector(payId)

  await payBtn.click()

  await page.waitForTimeout(10 * 1000)
  await page.screenshot({ path: `screenshots/${Game.name}/confirmation.png`, fullPage: true })
  await page.waitForTimeout(10 * 60 * 1000)
}