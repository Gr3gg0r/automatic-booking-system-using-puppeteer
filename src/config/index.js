const config = {
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASS,
  url: {
    authUrl: process.env.AUTH_URL,
    bookUrl: process.env.BOOK_URL,
    succUrl: process.env.SUCC_URL,
  },
  radioValue: [
    {
      id: "bookingTime446",
      value: 446,
    },
    {
      id: "bookingTime557",
      value: 557,
    },
  ],
};

module.exports = config;
