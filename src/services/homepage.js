const puppeteer = require("puppeteer");
const config = require("../config");

module.exports = async (cookies = []) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setCookie(...cookies);

  await page.goto(config.url.homeUrl);

  await page.waitForSelector('h4[class="icon-title feature-label"]');

  const data = await page.cookies();

  browser.close();

  return data;
};
