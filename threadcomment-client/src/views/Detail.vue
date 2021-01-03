<template>
    <div class="detail">
        <h2>新闻的id是：{{$route.params.id}}</h2>

        <h2>该新闻评论如下：</h2>
        <button @click="commitHandle">
            发评论
        </button>
        <!-- v-html的html字符串无法识别vue的指令，这里需要监听回复button的点击事件；可以采用如下方法：
            1）事件委托；将button的点击事件委托给v-html指令所在的标签；事件的回调函数中event.target就是真实触发事件的标签; （uni-app中v-html指令对应的e的target依旧指的是绑定事件的标签，无法使用）;
            2)原生写法，找标签，给标签添加事件。
        -->
        <div v-html="htmlStr" @click='replyHandle'></div>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: 'detail',
        data() {
            return {
                list: [],
                htmlStr: ''
            }
        },
        mounted() {
            // 基于新闻id，获取该新闻的所有评论；
            axios.get("/api/comments?id=" + this.$route.params.id).then(res => {
                this.list = res.data.list;
            })
        },
        methods: {
            commitHandle() {
                const deep = 0;
                const parentId = 0;
                const username = prompt("请输入用户名");
                const content = prompt("请输入评论内容");
                let newComment = { deep, parentId, content, username, newsId: this.$route.params.id };
                axios.post("/api/add", newComment).then(res => {
                    console.log(res);
                    newComment.id = res.data.id;
                    this.list.push(newComment);
                })
            },

            dataToHtml(obj) {
                var html = '';
                html += `<div>`;
                html += `<p>`;
                for (let i = 0; i < obj.deep; i++) {
                    html += '&#x3000;&#x3000;';
                }
                html += `${obj.username}:${obj.content}`;
                html += `<button class='reply' data-deep="${obj.deep}" data-commentid="${obj.id}">回复</button>`
                html += `</p>`;
                html += `</div>`;

                this.htmlStr += html;

                // 判断 结点 是否有 子节点
                if (obj.children && obj.children.length > 0) {
                    for (let i = 0; i < obj.children.length; i++) {
                        //递归 
                        this.dataToHtml(obj.children[i]);
                    }
                }
            },

            getCommentFromTree(comment, commentId) {
                if (comment.id == commentId) {
                    return comment;
                }
                if (comment.children && comment.children.length > 0) {
                    let result;
                    for (let i = 0; i < comment.children.length; i++) {
                        const cm = comment.children[i];
                        result = this.getCommentFromTree(cm, commentId);
                        if (result) {
                            return result;
                        }
                    }
                }
            },
            getCommentById(commentId) {
                let result;
                for (let i = 0; i < this.list.length; i++) {
                    var comment = this.list[i];
                    result = this.getCommentFromTree(comment, commentId);
                    if (result) {
                        return result;
                    }
                }
            },
            replyHandle(event) {
                console.log("replyHandle");
                console.log(event);
                console.log(event.target.dataset.commentid);
                if(event.target.tagName != "BUTTON"){
                    return ;
                }
                // 获取被点击评论的id
                const commentId = event.target.dataset.commentid;
                const pDeep = event.target.dataset.deep * 1;

                // 根据评论的id获取被点击评论对象；(树遍历，查询)
                const comment = this.getCommentById(commentId);
                console.log(comment);

                const deep = pDeep + 1;
                const username = prompt("请输入用户名");
                const content = prompt("请输入回复内容");

                let newComment = { deep, parentId: commentId, content, username, newsId: this.$route.params.id };
                axios.post("/api/add", newComment).then(res => {
                    console.log(res);
                    // 父节点之前无子节点；添加的这个是第一个子节点
                    if (!comment.children) {
                        // 向父节点对象添加children字段。
                        this.$set(comment, "children", []);
                    }
                    newComment.id = res.data.id;
                    comment.children.push(newComment);
                })
            }
        },
        watch: {
            list: {
                deep: true,
                handler: function (newValue) {
                    this.htmlStr = '';

                    for (let i = 0; i < newValue.length; i++) {
                        // 树遍历（深度遍历）；
                        this.dataToHtml(newValue[i]);
                    }

                    // 代码执行到这里，说明，htmlStr已经完全拼接好了;
                    // 等待本次数据更新渲染网页完成后，就可以查找这些标签了;
                    // this.$nextTick(() => {
                    //     const btns = document.querySelectorAll(".reply");
                    //     console.log(btns);
                    //     for(let i = 0 ; i < btns.length ; i++){
                    //         btns[i].onclick = ()=>{

                    //         }
                    //     }
                    // })
                }
            }
        }
    }
</script>