require("dotenv").config();
const express = require("express");
const app = express();

const controllers = require("./controllers");

app.get("/api", (_, res) => {
  return res.send({
    msg: "Api healthy",
  });
});

app.get("/api/book", controllers.get);

app.use((err, _, res, __) => {
  return res.status(500).send({
    error: err.message,
    err,
  });
});
app.listen(3000, () => {
  console.log("Apps is running on port 3000");
});
