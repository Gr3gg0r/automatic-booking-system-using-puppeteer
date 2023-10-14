const puppeteer = require("puppeteer");
const config = require("../config");

module.exports = async (username, password) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(config.url.authUrl, {
    waitUntil: "load",
    timeout: "0",
  });

  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.click('input[type="submit"]');

  await page.waitForSelector('a[href="/sas/bms/public/index.php/facility"]', {
    timeout: 10000,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const cookies = await page.cookies();

  await browser.close();

  return cookies;
};
