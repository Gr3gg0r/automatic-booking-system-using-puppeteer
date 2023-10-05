require("dotenv").config();
const dayjs = require("dayjs");
const config = require("./config");
const bookCourt = require("./services/bookCourt");
const login = require("./services/login");

const bookJob = async () => {
  const unskip = dayjs().add(9, "d").day();

  if (![1, 3, 5].includes(unskip)) {
    return Promise.all();
  }

  const cookies = await login(config.email, config.password);
  const radioValues = config.radioValue;
  for (const value of radioValues) {
    await bookCourt(cookies, value.id, value.value);
  }
  return Promise.resolve();
};

bookJob().catch((e) => console.error(e));

// Handle uncaught exceptions to prevent app termination
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

// Handle unhandled promise rejections to prevent app termination
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection:", reason);
});

console.log("Booking started.");
