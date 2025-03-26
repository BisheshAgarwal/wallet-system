require("dotenv").config();

const debug = require("debug")("server");

debug("Loading");

const appName = "backend";
debug(`${appName} init successful`);

const express = require("express");
const morgan = require("morgan");

const app = express();
const mongoose = require("mongoose");
const routers = require("./routers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

routers.map((router) => app.use("/api/", router));

app.get(["/", "/api"], (req, res) => {
  res.send("Ok");
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    debug("Connected to MongoDB");

    app.listen(PORT, async () => {
      console.log(`wallet-system api listening on port ${PORT}!`);
    });
  })
  .catch((err) => console.log(err));

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ message: "Internal server error", error: err.message });
});
