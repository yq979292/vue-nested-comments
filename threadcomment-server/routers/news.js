const express = require("express");
const pool = require("../pool");

const router = express.Router();


router.get("/api/news", (req, res) => {
   const {id:newsId} = req.query;
    pool.query("select * from news", [newsId], (error, result) => {
        console.log(result);
        res.json({
            code:1,
            message:"获取新闻数据成功",
            list:result
        })
    })
})


module.exports = router;