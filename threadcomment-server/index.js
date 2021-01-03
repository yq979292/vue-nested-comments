const express = require("express");
const bodyParser = require("body-parser");

const comments = require('./routers/comments');
const news = require('./routers/news');

const app = express();
app.use(bodyParser.json());

app.use(news);
app.use(comments);

app.listen(3000,()=>{
    console.log("3000...");
})