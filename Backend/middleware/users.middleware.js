
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).send({ msg: "Invalid token" });
    }

    req.user = user; // Attach user to the request
    next();
  } catch (error) {
    res.status(401).send({ msg: "Unauthorized" });
  }
};

const checkAdminRole = async (req, res, next) => {
  try {
   
    const userId = req.user._id; 
    const user = await UserModel.findById(userId);

    // if (!user) {
    //   return res.status(401).send({ msg: "User not found" });
    // }

    if (user.role !== "admin") {
      return res.status(403).send({ msg: "Access forbidden: Admins only" });
    }

    next(); 
  } catch (error) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};



module.exports = { authenticateUser, checkAdminRole };
