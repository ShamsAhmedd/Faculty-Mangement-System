const router = require("express").Router();
const conn = require("../db/dbConnection");
const admin = require("../middleware/admin");
const { body, validationResult } = require('express-validator');
const util = require("util");//helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");



// admin 
//create course
router.post("", admin,
    body("name")
        .isString()
        .withMessage("please enter a valid name")
        .isLength({ min: 4 })
        .withMessage("please enter at least 4 charcters "),
        body("code")
        .isString()
        .withMessage("please enter a valid code")
        .isLength({ min: 3 })
        .withMessage("please enter at least 3 charcters "),
    body("status")
        .isString()
        .withMessage("please enter a valid statues")
        .isLength({ max: 12 })
        .withMessage("please enter at most 1 charcters"),
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const checkCourseExists = await query("select * from courses where name =? OR code=? ", ([req.body.name,req.body.code]));
            if (checkCourseExists.length > 0) {
                res.status(400).json({ msg: "Name or code already exists" });
            }

            //prepare course object
            else {
                const course = {
                    name: req.body.name,
                    code:req.body.code,
                    status: req.body.status,
                };
                //insert course
                await query("insert into courses set ?", course);
                res.status(200).json({
                    msg: "course added",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ err: err });


        }

    });

//update  course
router.put("/update/:id",
    admin,
    body("name")
        .isString()
        .withMessage("please enter valid course name ")
        .isLength({ min: 8 })
        .withMessage("course name should be at least 8 characters"),
        body("code") 
        .isString()
        .withMessage("please enter a valid code")
        .isLength({ min: 3 })
        .withMessage("please enter at least 3 charcters "),
    body("status")
        .isString()
        .withMessage("please enter a valid statues")
        .isLength({ max: 12 })
        .withMessage("please enter at most 1 charcters"),

    async (req, res) => {
        try {
            const { id } = req.params;
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const course = await query("select * from courses where id = ?", [id]);
            if (!course[0]) {
                res.status(404).json({
                    msg: "course not found"
                });
            }
            const checkCourseExists = await query("select * from courses where name =? or code =? ", ([req.body.name,req.body.code]));
            if (checkCourseExists.length > 0) {
                res.status(400).json({ msg: "Course already exists" });
            }

            //prepare course object
            else {
                const courseObject = {
                    name: req.body.name,
                    code:req.body.code,
                    status: req.body.status
                }


                //update course
                await query("update courses set ? where id = ?", [courseObject, course[0].id])
                res.status(200).json({
                    msg: "course updated",
                });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//delete course
router.delete("/delete/:id",
    admin,
    async (req, res) => {
        try {

            //check is movie exists
            const { id } = req.params;

            const query = util.promisify(conn.query).bind(conn);
            const course = await query("select * from courses where id = ?", [id]);
            if (!course[0]) {
                res.status(404).json({
                    msg: "course not found"
                });
            }

            await query("delete from courses where id = ?", [course[0].id])
            res.status(200).json({
                msg: "course deleted",
            });

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//list course
router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
        search = `where name LIKE '%${req.query.search}%' or description LIKE '%${req.query.search}%'`
    }
    const course = await query(`select * from courses ${search}`);
    res.status(200).json(course);
});

//show course
router.get("/show/:id", async (req, res) => {
    const { id } = req.params;

    const query = util.promisify(conn.query).bind(conn);
    const course = await query("select * from courses where id = ?", [id]);
    if (!course[0]) {
        res.status(404).json({
            msg: "course not found"
        });
    }
    res.status(200).json(course[0]);
});
////////////////////////////////////////INSTRUCTOR////////////////////////////////////////////////
//create instructor[ADMIN]
router.post("/createInstructor",
    admin,
    body("email").isEmail().withMessage("please enter a valid email"),
    body("name")
        .isString()
        .withMessage("please enter a valid name")
        .isLength({ min: 5, max: 20 })
        .withMessage("name between 5 to 20"), 
    body("password").isLength({ min: 5, max: 20 }).withMessage("password between 5 to 20"),
    body("role")
        .isString()
        .withMessage("please enter avalid role role")
        .isLength({ max: 5 })
        .withMessage("please enter a valid role"),
    body("status")
        .isString()
        .withMessage("please enter a valid statues")
        .isLength({ max: 10 })
        .withMessage("please enter at most 1 charcters"),
    body("phone"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //check email
            const query = util.promisify(conn.query).bind(conn);
            const checkEmailExists = await query("select * from users where email =?", (req.body.email));
            if (checkEmailExists.length > 0) {
                res.status(400).json({ msg: "email already exists" });
            }
            // prepare object user
            else{const user = {
                email: req.body.email,
                name: req.body.name,
                password: await bcrypt.hash(req.body.password, 10),
                role: req.body.role,
                status: req.body.status,
                phone: req.body.phone,
                token: crypto.randomBytes(16).toString("hex"),
            };
            //insert user object into db
            await query("insert into users  set ? ", [user]);

 
            delete user.password;
            res.status(200).json(user);

            res.json("success");}

        } catch (err) {
            console.log(err);
            res.status(400).json({ err: err });

        }
    })


    
//update instructor
router.put("/updateI/:id",
    admin,
    body("email").isEmail().withMessage("please enter a valid email"),
    body("name")
        .isString()
        .withMessage("please enter a valid name")
        .isLength({ min: 5, max: 20 })
        .withMessage("name between 5 to 20"),
    body("password").isLength({ min: 5, max: 20 }).withMessage("name between 5 to 20"),
    body("role")
        .isString()
        .withMessage("please enter avalid role role")
        .isLength({ max: 5 })
        .withMessage("please enter a valid role"),
    body("status")
        .isString()
        .withMessage("please enter a valid statues")
        .isLength({ max: 12 }) 
        .withMessage("please enter at most 1 charcters"),
    body("phone"),

    async (req, res) => {
        try {
            const { id } = req.params;
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const instructor = await query("select * from users where id = ? AND role=?", [id, 2]);
            if (!instructor[0]) {
                res.status(404).json({
                    msg: "this is not instructor"
                });
            }
            const checkEmailExists = await query("select * from users where email =? ", (req.body.email));
            if (checkEmailExists.length > 0) {
                res.status(400).json({ msg: "email already exists" });
            }            


            //prepare instructor object
            else{const instructorObject = {
                email: req.body.email,
                name: req.body.name,
                password: await bcrypt.hash(req.body.password, 10),
                role: req.body.role,
                status: req.body.status,
                phone: req.body.phone,
                token: crypto.randomBytes(16).toString("hex"),
            }


            //update instructor
            await query("update users set ? where id = ? ", [instructorObject, instructor[0].id])
            res.status(200).json({
                msg: "instructor updated",
            });}

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//delete instructor
router.delete("/deleteI/:id",
    admin,
    async (req, res) => {
        try {

            //check is instructor exists
            const { id } = req.params;

            const query = util.promisify(conn.query).bind(conn);
            const instructor = await query("select * from users where id =? AND role=?", [id, 2]);
            if (!instructor[0]) {
                res.status(404).json({
                    msg: "this is not instructor"
                });
            }
            await query("delete from users where id = ? AND role=?", [instructor[0].id, 2])
            res.status(200).json({
                msg: "instructor deleted",
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//list instructor
router.get("/listI", admin,
    async (req, res) => {
        const query = util.promisify(conn.query).bind(conn);
        const instructor = await query(`select * from users where role=2  `);
        res.status(200).json(instructor);
    });

//show instructor
router.get("/showI/:id", admin, async (req, res) => {
    const { id } = req.params;
    const query = util.promisify(conn.query).bind(conn);
    const instructor = await query("select * from users where id = ? AND role=?", [id, 2]);
    if (!instructor[0]) {
        res.status(404).json({
            msg: "this is not instructor"
        });
    }
    res.status(200).json(instructor[0]);
});


//assign instructor to course
router.put("/assignI/:id",
    admin,
    body("name")
    .isString()
    .withMessage("please enter a valid course name")
    .isLength({ min: 2 })
    .withMessage("please enter at least 2 characters"),
    async (req, res) => {
            try {
                const { id } = req.params;
                const query = util.promisify(conn.query).bind(conn);
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  return res.status(400).json({ errors: errors.array() });
                }
          
                // 2- CHECK IF Instructor EXISTS OR NOT
                const instructor = await query("select * from users where id = ? AND status ='active' ", [id]);
                if (!instructor[0]) {
                  res.status(404).json({ ms: "instructor not found !" });
                }
                // 2- CHECK IF course EXISTS OR NOT
                
                const course = await query("select * from courses where name = ? AND status ='active'", [req.body.name]);
                if (!course[0]) {
                  res.status(404).json({ ms: "course not found !" });
                }
                
                    
                // 4- ASSIGN COURSE
                await query("update courses SET instructorID=? where name = ?", [instructor[0].id,course[0].name]);
          
                res.status(200).json({
                  msg: "assign updated successfully",
                });
              } catch (err) {
                console.log(err);
                res.status(500).json(err);
              }
    });



module.exports = router;