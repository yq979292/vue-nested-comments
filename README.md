## 嵌套评论业务

### 运行环境
1: 安装node

2: 安装vue-cli@3版本的

3：安装mysql
   数据库名  threadcomment
   密码：    123456
   用户名：  root
   新建表  comments 
   
   字段名如下
   > newsId,username,content,parentId,deep

### 启动
cd ~/threadcomment-client
`npm i `
`npm run serve` 启动vue端

cd ~/threadcomment-server
`npm i`
`node index.js` 启动服务端
