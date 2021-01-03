const mysql = require("mysql");
const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"123456",
    database:"threadcomment"
})
module.exports = pool;