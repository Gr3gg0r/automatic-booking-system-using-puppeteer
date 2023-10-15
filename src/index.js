#!/usr/bin/node
require("dotenv").config();
const dayjs = require("dayjs");
const config = require("./config");
const bookItem = require("./services/bookItem");
const login = require("./services/login");
const schedule = require("node-schedule");

const bookJob = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  const unskip = dayjs().add(10, "d").day();

  if (![1, 2, 3, 4, 5].includes(unskip)) {
    console.log("skipday");
    return Promise.resolve();
  }

  console.log("Initiate login");
  const cookies = await login(config.email, config.password);
  const radioValues = config.radioValue;
  console.log("Initiate booking");
  await Promise.all(
    radioValues.map(async (value, i) => {
      await bookItem(cookies, value.id, value.value).catch((e) => {
        console.error("failed " + (i + 1));
        throw e;
      });
    })
  );
  return Promise.resolve();
};

schedule.scheduleJob("00 00 * * *", () => {
  bookJob().catch((e) => {
    const date = dayjs().toString();
    console.error({
      message: "Failed booking",
      date,
    });
  });
});

// Handle uncaught exceptions to prevent app termination
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

// Handle unhandled promise rejections to prevent app termination
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection:", reason);
});

console.log("Booking started. ", dayjs().toString());
