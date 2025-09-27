const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxLength: 30,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxLength: 30,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (validator.isStrongPassword(value) === false) {
          throw new Error("Password is not enough strong" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      validate(value) {
        if (
          ["male", "female", "other"].includes(value.toLowerCase()) === false
        ) {
          throw new Error("Gender not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://weimaracademy.org/dummy-user/",
      validate(value) {
        if (validator.isURL(value) === false) {
          throw new Error("Photo URL is not valid" + value);
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEVTINDER_SECRET", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = await bcrypt.compare(passwordInputByUser, user.password);
  return passwordHash;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
