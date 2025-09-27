const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching profile" + error);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit fields");
    }
    const user = req.user;
    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });
    await user.save();
    res.json({
      message: `${user.firstName}, your profile updated successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).send("Error editing profile" + error);
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("All fields are required");
    } else if (oldPassword === newPassword) {
      throw new Error("New password must be different from old password");
    }
    const isMatch = await user.validatePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).send("Error updating password" + error);
  }
});

module.exports = { router };
