const dayjs = require("dayjs");
const login = require("../services/login");
const bookItem = require("../services/bookItem");
const config = require("../config");
const homepage = require("../services/homepage");
const fs = require("fs").promises;

const readCookies = async () => {
  try {
    const data = await fs.readFile("cookies.json");
    return JSON.parse(data);
  } catch (error) {
    return false;
  }
};

const writeCookies = async (cookies) => {
  await fs.writeFile("cookies.json", JSON.stringify(cookies));
};

const getLogin = async (req, res, next) => {
  try {
    const cookies = await login(config.email, config.password);
    await writeCookies(cookies);
    return res.send({
      mssg: "Successfully register cookies",
    });
  } catch (e) {
    return next(e);
  }
};

const getRefresh = async (req, res, next) => {
  try {
    const cookies = await readCookies();

    if (!cookies) {
      throw new Error("Cookies not exists");
    }

    const refreshCookies = await homepage(cookies);

    await writeCookies(refreshCookies);

    return res.send({
      mssg: "Successfully refresh cookies",
    });
  } catch (e) {
    next(e);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { type = "BADMINTON", day = 10, bullet1, bullet2 } = req.body;

    const cookies = await readCookies();

    if (!cookies) {
      throw new Error("Cookies not found");
    }

    const radioValues = [
      {
        id: "bookingTime" + bullet1,
        value: bullet1,
      },
      {
        id: "bookingTime" + bullet2,
        value: bullet2,
      },
    ];

    const results = await Promise.allSettled(
      radioValues.map(async (value, i) => {
        try {
          await bookItem(cookies, value.id, value.value, day, type);
        } catch (e) {
          errors.push(e);
          return Promise.reject(e);
        }
      })
    );

    const hasErrors = results.some((result) => result.status === "rejected");

    if (hasErrors) {
      return res.status(500).send({
        mssg: "Some promises failed",
        date: dayjs().toString(),
        errors: errors.map((error) => error.message),
      });
    }

    return res.send({
      mssg: "Success booking for " + dayjs().add(day, "d").toString(),
      date: dayjs().toString(),
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { getLogin, getRefresh, createBook };
