const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;

/* GET users listing. */
router.use((req, res, next) => {
  console.log("A request is coming in to auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "TEST API is working",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  //check the validation of data
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check user exist or not
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("Email has already been registered");

  //register the user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      savedObj: savedUser,
    });
  } catch (err) {
    res.status(400).send("User not saved.");
  }
});

router.post("/login", (req, res) => {
  //check the validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      //or redirect to register page
      res.status(401).send("User not found");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err);
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ sucess: true, token: "JWT" + token, user });
        } else {
          res.status(401).send("Worng password");
        }
      });
    }
  });
});

module.exports = router;
