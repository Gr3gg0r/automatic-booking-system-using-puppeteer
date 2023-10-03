const dayjs = require("dayjs");
const login = require("../services/login");
const config = require("../config");
const bookCourt = require("../services/bookCourt");

exports.get = async (_, res, next) => {
  try {
    const unskip = dayjs().add(10, "d").day();

    if (![1, 3, 5].includes(unskip)) {
      return res.sendStatus(204);
    }

    const cookies = await login(config.email, config.password);
    const radioValues = config.radioValue;
    for (const value of radioValues) {
      await bookCourt(cookies, value.id, value.value);
    }
    return res.send({ msg: "Success book court" });
  } catch (e) {
    return next(e);
  }
};
