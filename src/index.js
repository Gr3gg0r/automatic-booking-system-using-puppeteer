require("dotenv").config();
const dayjs = require("dayjs");
const config = require("./config");
const bookCourt = require("./services/bookCourt");
const login = require("./services/login");
const schedule = require("node-schedule");

const bookJob = async () => {
  const unskip = dayjs().add(9, "d").day();

  if (![1, 3, 5, 0].includes(unskip)) {
    return Promise.resolve();
  }

  const cookies = await login(config.email, config.password);
  const radioValues = config.radioValue;
  for (const value of radioValues) {
    await bookCourt(cookies, value.id, value.value);
  }
  return Promise.resolve();
};

schedule.scheduleJob("25 01 * * 0,2,5", () => {
  bookJob().catch((e) => {
    console.log(e);
  });
});

// bookJob().catch((e) => console.error(e));


// Handle uncaught exceptions to prevent app termination
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

// Handle unhandled promise rejections to prevent app termination
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection:", reason);
});

console.log("Booking started.");
