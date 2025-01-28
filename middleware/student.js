const conn = require("../db/dbConnection");
const util = require("util");//helper

const autherized = async (req, res, next) => {
    const query = util.promisify(conn.query).bind(conn);
    const { token } = req.headers;
    const user = await query("select * from users where token = ?", [token]);
    if (user[0]&& user[0].role == "0") {
        res.locals.user=user[0];
        next();
    } else {
        res.status(403).json({
            msg: "you are not autherized to access route",
        })
    }
    

}
module.exports = autherized;