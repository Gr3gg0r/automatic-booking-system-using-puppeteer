#!/usr/bin/node
require("dotenv").config();
const dayjs = require("dayjs");
const config = require("./config");
const bookCourt = require("./services/bookCourt");
const login = require("./services/login");
const schedule = require("node-schedule");

const bookJob = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  const unskip = dayjs().add(10, "d").day();

  if (![1, 3, 5].includes(unskip)) {
    return Promise.resolve();
  }

  const cookies = await login(config.email, config.password);
  const radioValues = config.radioValue;
  await Promise.all(
    radioValues.map(async (value, i) => {
      await bookCourt(cookies, value.id, value.value).catch((e) => {
        console.error("failed " + (i + 1));
        throw e;
      });
    })
  );
  // for (const value of radioValues) {
  //       await bookCourt(cookies, value.id, value.value);
  // }
  return Promise.resolve();
};

schedule.scheduleJob("00 00 * * 0,2,5", () => {
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
