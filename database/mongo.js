const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connect successfully");
  })
  .catch((err) => {
    console.log(err);
  });
