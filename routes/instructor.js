const router = require("express").Router();
const conn = require("../db/dbConnection");
const instructor = require("../middleware/doctors");
const { body, validationResult } = require('express-validator');
const util = require("util");//helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//view enrolled student
router.get("/list/:id", instructor,

 async (req, res) => { 
    try {
      const query = util.promisify(conn.query).bind(conn);
      const usersID = await query(
        `SELECT name, studentID FROM users JOIN studentcourse 
        ON users.id = studentcourse.studentID WHERE studentcourse.courseID = ${req.params.id}`,
        []
      );
      
      res.status(200).json(usersID);
    } catch (error) {
      console.log(error);
    }
  });
  
  // assign grade to student
  router.put(
    "/assignGrades",
    instructor, // params
    body("courseID"),
    body("grade"),
    body("studentID"),
    async (req, res) => {
      try {
        const query = util.promisify(conn.query).bind(conn);
        // 2- CHECK IF user EXISTS OR NOT
        const user = await query(
          "select * from studentcourse where studentID = ? AND courseID = ?",
          [req.body.studentID,req.body.courseID]
        );
        if (!user[0]) {
          res.status(404).json({ ms: "User or course not found !" });
        }
  
        // 4- ASSIGN COURSE
        await query(
            "update studentcourse set grade=? where courseID = ? AND studentID = ?",
            [req.body.grade, req.body.courseID, req.body.studentID]
          );
        res.status(200).json({
          msg: "assign grade successfully",
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  );
  


module.exports = router;