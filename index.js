#!/usr/bin/node
require("dotenv").config();
const dayjs = require("dayjs");
const config = require("./src/config");
const bookItem = require("./src/services/bookItem");
const login = require("./src/services/login");
const schedule = require("node-schedule");

const calculateDelay = () => {
  const now = dayjs();
  const secondsUntilNextMinute = 60 - now.second() - 1;

  // Calculate the delay in milliseconds until the next minute
  const delay = secondsUntilNextMinute * 1000;

  return delay;
};

const bookJob = async () => {
  console.time("login");
  console.log("Initiate login");
  const { cookies, browser } = await login(config.email, config.password);
  const radioValues = config.radioValue;
  console.log("Success login");
  console.timeEnd("login");
  await new Promise((resolve) => setTimeout(resolve, calculateDelay()));
  console.log("Initiate booking");
  console.time("booking");
  await Promise.allSettled(
    radioValues.map(async (value, i) => {
      await bookItem(browser, cookies, value.id, value.value).catch((e) => {
        console.error("failed " + (i + 1));
        throw e;
      });
    })
  );
  console.timeEnd("booking");
  await browser.close();
  console.log("Success");
  return Promise.resolve();
};

schedule.scheduleJob("59 23 * * *", () => {
  bookJob().catch((e) => {
    const date = dayjs().toString();
    console.error(
      {
        message: "Failed booking",
        date,
      },
      e
    );
  });
});

console.log(calculateDelay());

// Handle uncaught exceptions to prevent app termination
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

// Handle unhandled promise rejections to prevent app termination
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection:", reason);
});

console.log("Booking started. ", dayjs().add(8, "h").toString());
