import puppeteer from 'puppeteer'

export default interface Site {
  name: string;
  isAvailable(page: puppeteer.Page): Promise<boolean>;
  attemptPurchase(page: puppeteer.Page): Promise<void> ;
}