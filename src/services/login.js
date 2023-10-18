const puppeteer = require("puppeteer");
const config = require("../config");

module.exports = async (username, password) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(config.url.authUrl);

  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.click('input[type="submit"]');

  await page.waitForSelector('a[href="/sas/bms/public/index.php/facility"]', {
    timeout: 10000,
  });

  const cookies = await page.cookies();

  browser.close();

  return cookies;
};
