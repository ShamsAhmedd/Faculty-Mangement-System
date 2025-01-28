const router = require("express").Router();
const conn = require("../db/dbConnection");
const student = require("../middleware/student");
const { body, validationResult } = require('express-validator');
const util = require("util");//helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//assign course
router.post(
    "/registerCourse",
    student,
    body("studentID ")
        .isLength({ max: 2 })
        .withMessage("please enter a your valid ID!"),
    body("courseID")
        .isLength({ max: 2 })
        .withMessage("please enter valid course ID"),
    async (req, res) => {
        try {
            // 1- VALIDATION REQUEST [manual, express validation]
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- CHECK IF student EXISTS
            const query = util.promisify(conn.query).bind(conn);

            const checkstudentExists = await query(
                "select * from users where id = ? AND role=0 AND status ='active'",
                [req.body.studentID]
            );
            if (checkstudentExists.length == 0) {
                res.status(404).json({
                    errors: [ 
                        {
                            msg: "student is not found !", 
                        },
                    ],
                });
            }

 
            else {
                const checkcourseExists = await query(
                    "select * from courses where id = ? AND status ='active'",
                    [req.body.courseID]
                );
                if (checkcourseExists.length == 0) {
                    res.status(404).json({
                        errors: [
                            {
                                msg: "course is not found !", 
                            },
                        ],
                    }); 
                }
                const checkAssignExists = await query("select * from studentcourse where studentID =? AND courseID =? ",
                ([req.body.studentID, req.body.courseID]));
                if (checkAssignExists.length > 0) {
                    res.status(400).json({ msg: "Assign exists" });
                }

                // 3- PREPARE OBJECT register data TO -> SAVE
                else { 
                    const registerdata = {
                        studentID: req.body.studentID,
                        courseID: req.body.courseID,
                    }; 



                    // 4- INSERT USER OBJECT INTO DB
                    await query("insert into studentcourse set ? ", registerdata);
                    res.status(200).json(registerdata);
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
);

//view grades
router.get("/:id", student,
    async (req, res) => {
        const { id } = req.params
        const query = util.promisify(conn.query).bind(conn);
        const studentGrade = await query(`select * from studentcourse where studentID=?  `, [id]);
        res.status(200).json(studentGrade);
    });


module.exports = router;