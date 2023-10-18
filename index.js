#!/usr/bin/node
require("dotenv").config();
const dayjs = require("dayjs");
const config = require("./src/config");
const bookItem = require("./src/services/bookItem");
const login = require("./src/services/login");
const schedule = require("node-schedule");

const bookJob = async () => {
  // const unskip = dayjs().add(10, "d").day();

  // if (![0, 1, 2, 3, 4, 5, 6].includes(unskip)) {
  //   console.log("skipday");
  //   return Promise.resolve();
  // }

  console.log("Initiate login");
  const cookies = await login(config.email, config.password);
  const radioValues = config.radioValue;
  await new Promise((resolve) => setTimeout(resolve, 56000));
  console.log("Initiate booking");
  await Promise.allSettled(
    radioValues.map(async (value, i) => {
      await bookItem(cookies, value.id, value.value).catch((e) => {
        console.error("failed " + (i + 1));
        throw e;
      });
    })
  );
  return Promise.resolve();
};

schedule.scheduleJob("59 23 * * *", () => {
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

console.log("Booking started. ", dayjs().add(8, "h").toString());
