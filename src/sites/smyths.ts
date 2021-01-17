import puppeteer from "puppeteer";
import { Site, clickButton, fillForm } from "./site";
import fs from "fs";
import { Config } from "../config";

export default class Smyths implements Site {
  name: string = "Smyths";
  productUrl: string =
    "https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-console/p/191259";

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

    const addToCartBtn = await page.$('button[id="addToCartButton"]');
    const enabled = await page.evaluate((btn) => {
      return !btn.disabled;
    }, addToCartBtn);

    return enabled;
  }

  async attemptPurchase(page: puppeteer.Page, config: Config): Promise<void> {
    const [button] = await page.$x(
      '//*[@id="cookieLoad"]/div/div/div[1]/div[4]/div[1]/button'
    );
    if (button) {
      await button.click();
    }

    await page.waitForTimeout(5000);

    const addToCartId = 'button[id="addToCartButton"]';
    await clickButton(addToCartId, page);

    const basketId = 'a[href="/uk/en-gb/cart"]';
    await clickButton(basketId, page);

    const checkoutId = 'button[id="checkoutOnCart"]';
    await clickButton(checkoutId, page);

    const emailId = 'input[id="guest.email"]';
    await fillForm(emailId, config.personalDetails.email, page);
    await page.keyboard.press("Tab");
    await page.keyboard.type(config.personalDetails.email);
    await page.keyboard.press("Enter");

    const firstNameId = 'input[id="firstName"]';
    await fillForm(firstNameId, config.personalDetails.firstName, page);
    await page.keyboard.press("Tab");
    await page.keyboard.type(config.personalDetails.lastName);
    await page.keyboard.press("Tab");
    await page.keyboard.type(config.personalDetails.phoneNumber);
    await page.keyboard.press("Tab");
    await page.keyboard.type(config.deliveryAddress.postcode);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(3000);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    const continueId = 'button[id="addressSubmit"]';
    await clickButton(continueId, page);

    const deliveryContinueId = 'button[id="deliveryMethodSubmit"]';
    await clickButton(deliveryContinueId, page);

    // Payment Details
    const cardNumberId = 'input[id="cardNumberPart1"]';
    const cardNumberInput = await page.waitForSelector(cardNumberId);
    await cardNumberInput.focus();
    await page.waitForTimeout(1000);
    await page.keyboard.type(config.cardDetails.number);

    const cardExpiryMonthId = 'button[data-id="expiryMonth"]';
    await clickButton(cardExpiryMonthId, page);

    const expiryMonth = config.cardDetails.expiry.substr(0, 2);
    const cardExpiryMonthDate = `li[rel="${expiryMonth}"]`;
    await clickButton(cardExpiryMonthDate, page);

    const cardExpiryYearId = 'button[data-id="expiryYear"]';
    await clickButton(cardExpiryYearId, page);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.keyboard.press("Tab");
    await page.keyboard.type(config.cardDetails.cvv);

    const checkboxId =
      "#accordion > div > div > div > div.panel-body > div:nth-child(3) > div > div > label:nth-child(1)";
    await clickButton(checkboxId, page);

    await page.screenshot({
      path: `screenshots/${this.name}/checkout.png`,
      fullPage: true,
    });
    await page.waitForTimeout(10 * 1000);

    const orderId = 'button[id="placeOrder"]';
    await clickButton(orderId, page);
    await page.waitForTimeout(10 * 60 * 1000);

    await page.screenshot({
      path: `screenshots/${this.name}/confirmation.png`,
      fullPage: true,
    });
    await page.waitForTimeout(3 * 60 * 1000);
  }
}
