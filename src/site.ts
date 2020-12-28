import puppeteer from 'puppeteer'

export default interface Site {
  name: string;
  productUrl: string;
  isAvailable(page: puppeteer.Page): Promise<boolean>;
  attemptPurchase(page: puppeteer.Page): Promise<void> ;
}