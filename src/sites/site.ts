import puppeteer from 'puppeteer'
import { Config } from '../config';

export interface Site {
  name: string;
  productUrl: string;
  isAvailable(page: puppeteer.Page): Promise<boolean>;
  attemptPurchase(page: puppeteer.Page, config: Config): Promise<void> ;
}

export async function clickButton(selector: string, page: puppeteer.Page) {
  const button = await page.waitForSelector(selector);
  await button.click();
}

export async function fillForm(selector: string, text: string, page: puppeteer.Page) {
  const input = await page.waitForSelector(selector);
  await input.focus();
  await page.keyboard.type(text, {delay: 10});
}