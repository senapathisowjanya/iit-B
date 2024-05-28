const express = require('express')
const bodyParser = require("body-parser"); 
const multer = require("multer");
const path = require("path");
const userRoute = require("./controllers/users.controller")
const { connectDB } = require("./config/db")
const app = express()
const cors = require("cors")


app.use(cors());
app.use(express.static("uploads"))
app.use(express.json())
app.use(express.json({ limit: "100mb" }));

app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/users",userRoute)

app.listen(8080,async() => {
    try {
        await connectDB
        console.log("database connected")
    } catch (error) {
       console.log("something went wrong") 
    }
})