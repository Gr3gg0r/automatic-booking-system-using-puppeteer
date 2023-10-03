require("dotenv").config();
const schedule = require("node-schedule");
const config = require("./config");
const bookCourt = require("./services/bookCourt");
const login = require("./services/login");

const bookJob = async () => {
  const cookies = await login(config.email, config.password);
  const radioValues = config.radioValue;
  for (const value of radioValues) {
    await bookCourt(cookies, value.id, value.value);
  }
  return Promise.resolve();
};

const job = schedule.scheduleJob("03 00 * * 0,2,5", () => {
  bookJob().catch((e) => {
    console.log(e);
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

console.log("Scheduler started.");