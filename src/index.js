require("dotenv").config();
const express = require("express");
const app = express();

const controllers = require("./controllers/index");
const dayjs = require("dayjs");

app.use(express.json());

app.get("/api", (_, res) => {
  return res.send({
    msg: "Api healthy",
    date: dayjs().toString(),
    version: "0.1.0",
  });
});

app.get("/api/login", controllers.getLogin);

app.get("/api/refresh", controllers.getRefresh);

app.post("/api/book", controllers.createBook);

app.use((err, _, res, __) => {
  return res.status(500).send({
    mssg: "Something broke!",
    err: err.message,
    stack: err.stack,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Apps is running on port " + port);
});
