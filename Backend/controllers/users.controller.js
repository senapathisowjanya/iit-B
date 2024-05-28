const express = require("express");
const multer = require("multer");
const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateUser,checkAdminRole} = require("../middleware/users.middleware");

const userRoute = express.Router();
require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/photo");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

userRoute.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { username, email, password, dob, role } = req.body;
      const photo = req.files.profilePic
        ? req.files.profilePic[0].filename
        : null;
      const resume = req.files.resume ? req.files.resume[0].filename : null;
      console.log("profilePic", photo);
      console.log("resume", resume);
      // const resume = req.files.resume[0].path;

      const userCheck = await UserModel.findOne({ email });
      if (userCheck) {
        return res.status(401).send({
          msg: "User Already Registered, Please Login !",
        });
      } else {
        bcrypt.hash(password, 5, async (err, hash) => {
          const newUser = new UserModel({
            username,
            email,
            password: hash,
            dob,
            role,
            photo,
            resume,
          });
          await newUser.save();
          res.status(201).send({
            msg: `User Successfully Registered`,
          });
        });
      }
    } catch (error) {
      res.status(400).send({
        msg: error.message,
      });
    }
  }
);

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const userCheck = await UserModel.findOne({ email });
    // console.log(userCheck);
    if (userCheck) {
      if (!userCheck.isApproved && userCheck.role === 'user') {
        // console.log("info false")
        return res.status(200).send({
          msg: "Invalid credentials or user not approved",
        });
      }
      bcrypt.compare(password, userCheck.password, (err, result) => {
        //   console.log(result,"hello")
        if (result) {
          const token = jwt.sign(
            { RuserID: userCheck._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          return res.status(200).send({
            msg: "Login Success",
            token: token,
            user: userCheck,
          });
        } else {
          return res.status(401).send({
            msg: "Invalid password",
          });
        }
      });
    } else {
      return res.status(401).send({
        msg: "No User Found, Please Register First!",
      });
    }
  } catch (error) {
    return res.status(401).send({
      msg: error.message,
    });
  }
});

userRoute.get("/dashboard", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ msg: `Error: admin dashboard ${error.message}` });
  }
});

userRoute.put("/approve/:id", async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  let data = user.isApproved;
  console.log("data bool", data);
  user.isApproved = !data;
  await user.save();
  res.status(200).send({ msg: "User approved or disapproved!" });
});

userRoute.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await UserModel.findByIdAndDelete(userId);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting user",
      error: error.message,
    });
  }
});


userRoute.post("/update/:id", async (req, res) => {
  try {
    console.log(req.body)
    const { username, dob, email } = req.body;
    console.log("name", username);
    const userId = req.params.userId;
    console.log("userId: " + userId);
    const updatedUser = await UserModel.findById(req.params.id);
    updatedUser.username = username;
    updatedUser.email = email;
    updatedUser.dob = dob
    await updatedUser.save();

    res.status(200).send({ msg: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = userRoute;
