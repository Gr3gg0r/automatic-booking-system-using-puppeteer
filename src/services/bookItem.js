const puppeteer = require("puppeteer");
const config = require("../config");
const dayjs = require("dayjs");

const get10DaysFromNow = (day) => {
  return dayjs().add(day, "d").format("YYYY-MM-DD");
};

module.exports = async (
  cookies,
  radioId,
  radioVal,
  day = 10,
  type = "BADMINTON"
) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setCookie(...cookies);
  console.log("success set cookies");

  await page.goto(
    config.url.bookUrl + "/" + get10DaysFromNow(day) + "/" + type
  );

  console.log("Success navigate to booking page");

  await page.$eval(
    `input[name="bookingTime"][id="${radioId}"][value="${radioVal}"]`,
    (radio) => radio.click()
  );
  console.log(
    `Success click on radio button ${radioVal == 446 ? "21:00:00" : "22:00:00"}`
  );

  await page.click('input[type="submit"]');
  console.log("Success submit");

  await page.waitForSelector('input[name="name"][value="A-17-12"]', {
    timeout: 10000,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.$eval('button[type="submit"]', (button) => button.click());
  console.log("Success submit reserve");

  await page.waitForSelector('input[name="paymentdeposit"]', {
    timeout: 10000,
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.$eval('button[type="submit"]', (button) => button.click());
  console.log("Success submit booking");

  await page.waitForNavigation({
    url: config.url.succUrl,
  });
  console.log("Booking success page, done booking");

  await browser.close();
};
