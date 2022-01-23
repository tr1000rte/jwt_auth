const express = require("express");
const router = express.Router();

const Course = require("../models").courseModel;
const courseValidation = require("../validation").courseValiation;

router.use((req, res, next) => {
  console.log("A request is comong into course_api");
  next();
});

router.post("/", async (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error);

  let { title, description, price } = req.body;
  if (!req.user.isInstructor) {
    return res.status(400).send("Only instructor can post a new course");
  }

  let newCourse = new Course({
    title,
    description,
    price,
  });

  try {
    await newCourse.save();
    res.status(200).send("New course saved successfully");
  } catch (err) {
    res.status(400).send("Save course data error");
  }
});

module.exports = router;
