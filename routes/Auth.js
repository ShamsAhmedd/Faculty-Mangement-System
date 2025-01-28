const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require('express-validator');
const util = require("util");//helper
const bcrypt = require("bcrypt");
const crypto = require("crypto"); 
const admin = require("../middleware/admin");

//login[ALL]
router.post("/login",
    body("email").isEmail().withMessage("please enter a valid email"),
    body("password").isLength({ min: 8, max: 12 }).withMessage("name between 8 to 12"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            
            //check email
            const query = util.promisify(conn.query).bind(conn);
            const checkEmailExists = await query("select * from users where email = ?", [req.body.email]);
            if (checkEmailExists.length == 0) {
                res.status(404).json({
                    errors: [
                        {
                            msg: "email or password not found",
                        },
                    ],
                });
            }

            //compare password
            const checkPassword = await bcrypt.compare(req.body.password, checkEmailExists[0].password)
            if (checkPassword) {
                delete checkEmailExists[0].password;
                res.status(200).json(checkEmailExists[0]);
            }
            else {
                res.status(404).json({
                    errors: [
                        {
                            msg: "email or password not found",
                        },
                    ],
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });

        }
    });

//registration[ALL]
router.post("/register",
    body("email").isEmail().withMessage("please enter a valid email"),
    body("name")
        .isString()
        .withMessage("please enter a valid name")
        .isLength({ min: 10, max: 20 })
        .withMessage("name between 10 to 20"),
    body("password").isLength({ min: 8, max: 12 }).withMessage("name between 8 to 12"),

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
                res.status(400).json({
                    errors: [
                        {
                            "msg": "email already exists",
                        },
                    ],
                });
            }
            // prepare object user
           else{ const user = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                token: crypto.randomBytes(16).toString("hex"),
            };
            //insert user object into db
            await query("insert into users set ?", user);
            delete user.password;
            res.status(200).json(user);

            res.json("success");
        }
        } catch (err) {
            console.log(err);
            res.status(400).json({ err: err });

        }
    })

    //LOG OUT
    router.put("/logout/:id", async (req, res) => {
        try {
        const {id}= req.params;
          const query = util.promisify(conn.query).bind(conn); //transform query mysql -> promise to use [await/async]
          await query("UPDATE users SET status = 'in active' WHERE id = ?", [id]);
          res.json("successfully logged out");
        } catch (error) {
          console.log("ERROR!!!!!!!!!"); 
          console.log(error);
          res.status(500).json({ error: error });
        }
      });
      
      
module.exports = router;