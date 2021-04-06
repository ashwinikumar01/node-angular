const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");
const auctionRoutes = require("./routes/auction");

const app = express();

const connectUrl =
  "mongodb+srv://ashwini:" +
  process.env.MONGO_ATLAS_PW +
  "@api-client.vyavf.mongodb.net/api-client";

const connectConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose
  .connect(connectUrl, connectConfig)
  .then(() => {
    console.log("Connected to Mongo Database");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/", express.static(path.join(__dirname, "../dist/api-creation")));

app.use("/api/user", userRoutes);
app.use("/api/auction", auctionRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/api-creation/index.html"));
});

module.exports = app;
