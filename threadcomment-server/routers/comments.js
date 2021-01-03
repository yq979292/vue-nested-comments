const express = require("express");
const pool = require("../pool");

const router = express.Router();

function arrayToTree(treeArray) {
    // 存放结果树的数组；
    var r = [];
    // 临时对象;
    var tmpMap = {};
    for (var i = 0, l = treeArray.length; i < l; i++) {
        // 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
        tmpMap[treeArray[i]["id"]] = treeArray[i];
    }
    console.log('tmpMap', tmpMap);

    //
    for (i = 0, l = treeArray.length; i < l; i++) {
        //循环每一条数据的parentId，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去;
        var key = tmpMap[treeArray[i]["parentId"]];
        console.log('key', key);

        //如果这一项数据属于哪个数据的子级 (父节点存在)
        if (key) {
            // 如果这个数据没有children（父节点第一次有了子节点）
            if (!key["children"]) {
                key["children"] = [];
            } 
            // 将当前结点添加到父节点的children数组中。
            key["children"].push(treeArray[i]);
        } else {
            //如果没有这个Key值，就代表找不到属于哪个数据，那就代表没有父级,直接放在最外层 (没有父节点，找到一棵树的树根)
            r.push(treeArray[i]);
        }
    }
    return r
}

router.get("/api/comments", (req, res) => {
    console.log(req.query);
    const { id: newsId } = req.query;
    pool.query("select * from comments where newsId=? ", [newsId], (error, result) => {
        console.log(result);
        // 整理数据
        const list = arrayToTree(result);
        res.json({
            code:1,
            message:"该条新闻评论获取成功",
            list
        })
    })
})

router.post("/api/add",(req,res)=>{
    const {newsId,content,username,parentId,deep} = req.body;
    pool.query("insert into comments (newsId,username,content,parentId,deep) values(?,?,?,?,?)",[newsId,username,content,parentId,deep],(error,result)=>{    
        console.log(error);
        console.log(result);
        res.json({
            code:1,
            message:"新增评论成功",
            id:result.insertId
        })
    })
})


module.exports = router;