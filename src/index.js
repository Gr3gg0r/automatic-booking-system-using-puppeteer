require("dotenv").config();
const puppeteer = require("puppeteer");
const config = require("./config");
const dayjs = require("dayjs");
const bookCourt = require("./services/bookCourt");
const login = require("./services/login");

const job = async () => {
  try {
    const cookies = await login(config.email, config.password);
    const radioValues = config.radioValue;
    for (const value of radioValues) {
      await bookCourt(cookies, value.id, value.value);
    }
  } catch (e) {
    throw Error(e);
  }
};

job();


