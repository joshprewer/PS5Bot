import puppeteer from "puppeteer";
import { Site, fillForm, clickButton } from "./site";
import fs from "fs";

export default class JohnLewis implements Site {
  name: string = "John Lewis";
  productUrl: string = "https://www.johnlewis.com/sony-playstation-5-console-with-dualsense-controller/white/p5115192";

  constructor() {
    fs.mkdirSync(`screenshots/${this.name}`, { recursive: true });
  }

  async isAvailable(page: puppeteer.Page): Promise<boolean> {
    await page.goto(this.productUrl, {
      waitUntil: "load",
      timeout: 0,
    });
    await page.screenshot({
      path: `screenshots/${this.name}/productPage.png`,
      fullPage: true,
    });

    const addToCartBtn = await page.evaluate(() => {
      return document.querySelector("button[id='button--add-to-basket']");
    });
    const isAvailable = addToCartBtn !== null;
    return isAvailable;
  }

  async attemptPurchase(page: puppeteer.Page): Promise<void> {
    const cookeAcceptId = "button[data-test='allow-all']";
    await clickButton(cookeAcceptId, page);

    await page.waitForTimeout(2000);

    const buyButtonId = "button[id='button--add-to-basket']";
    await clickButton(buyButtonId, page);

    await page.waitForTimeout(2000);

    const goToBasketId =
      "#emwbis-anchor > div.add-to-basket-summary-and-cta > div.add-to-basket-confirmation-message.add-to-basket-confirmation-message--animate > div > a";
    await clickButton(goToBasketId, page);

    const checkoutId = "a[id='link-button--basket-continue-securely']";
    await clickButton(checkoutId, page);

    const signInId = "input[id='signin']";
    await clickButton(signInId, page);

    // Sign In
    const emailId = "input[id='email']";
    await fillForm(emailId, process.env.EMAIL, page);

    const passwordId = "input[id='password']";
    await fillForm(passwordId, process.env.JOHN_LEWIS_PWD, page);

    await page.keyboard.press("Enter");

    await page.waitForTimeout(5000);

    const [continePaymentBtn] = await page.$x(
      "//button[contains(., 'Continue to payment')]"
    );
    if (continePaymentBtn) {
      await continePaymentBtn.click();
    }

    // Payment Details
    await page.waitForTimeout(5000);
    const [cardBtn] = await page.$x(
      "//span[contains(., 'Credit / Debit card')]"
    );
    if (cardBtn) {
      await cardBtn.click();
    }

    const cardNumberId = "input[id='cardNumber']";
    await fillForm(cardNumberId, process.env.CARD_NUMBER, page);

    const cardNameId = "input[id='cardholderName']";
    await fillForm(cardNameId, process.env.CARD_NAME, page);

    const expiryId = "input[id='expiryDate']";
    await fillForm(expiryId, process.env.CARD_EXPIRY, page);

    const securityCodeId = "input[id='securityCode']";
    await fillForm(securityCodeId, process.env.CARD_CVV, page);

    await page.waitForTimeout(5000);

    await page.screenshot({
      path: `screenshots/${this.name}/checkout.png`,
      fullPage: true,
    });

    const payBtnId = "button[data-test='payment-submit-button']"
    await clickButton(payBtnId, page)

    await page.waitForTimeout(10 * 1000);
    await page.screenshot({
      path: `screenshots/${this.name}/confirmation.png`,
      fullPage: true,
    });
    await page.waitForTimeout(10 * 60 * 1000);
  }
}