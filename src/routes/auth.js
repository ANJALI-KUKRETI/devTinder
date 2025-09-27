const express = require("express");

const router = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

//signup
router.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (error) {
    res.status(500).send("Error signing up user" + error);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("User logged in successfully");
  } catch (error) {
    res.status(500).send("Error logging in user" + error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("User logged out successfully");
});

module.exports = { router };
