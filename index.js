// initialze express app
const express = require('express');
const app = express()
//global middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));//acsee url from encoded
const cors = require("cors");
app.use(cors());//allow http request localhost
//require modules
const auth = require("./routes/Auth");
const Admin = require("./routes/Admin");
const instructor = require("./routes/instructor");
const student = require("./routes/student");

//run
app.listen(4000, "localhost", () => {
    console.log("server run");
});
//api routes
app.use("/auth", auth);
app.use("/admin", Admin)
app.use("/instructor", instructor)
app.use("/student", student)