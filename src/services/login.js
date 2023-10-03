const puppeteer = require("puppeteer");

module.exports = async (username, password) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.ecommunity.my/sas/bms/public/index.php/login", {
    waitUntil: "load",
    timeout: "0",
  });

  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.click('input[type="submit"]');

  await page.waitForSelector('a[href="/sas/bms/public/index.php/facility"]', {
    timeout: 10000,
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const cookies = await page.cookies();

  await browser.close();

  return cookies;
};
