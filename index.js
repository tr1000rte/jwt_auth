const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();

const authRouter = require("./routes").auth;
const courseRouter = require("./routes").course;

require("./config/passport")(passport);
require("./database/mongo");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRouter);
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRouter
);

app.listen(process.env.PORT || 3001, () => {
  console.log(`App is listening at port 3001`);
});
