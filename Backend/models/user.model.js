const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  dob: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"]
  },
  photo: {
    type: String,
  },
  resume: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});
const UserModel=mongoose.model("User",userSchema)
module.exports =UserModel
