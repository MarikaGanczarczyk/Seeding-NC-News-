const express = require("express");

const { getApi, getTopics } = require("./app/controllers/topics.controller");
const {getArticlesID, getArticles,getCommentsByArticleId, patchArticles}= require("./app/controllers/articles.controller");
const {postComment, deleteComment} = require("./app/controllers/comments.controller");
const { getUsers } = require("./app/controllers/users.controlles");
const app = express();
const cors = require('cors')

app.use(cors())

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesID);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticles)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)


app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
  });

app.use((err, req, res, next) => {

 
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

  

app.use((err, req, res, next) => {
   
    
  res.status(500).send({ msg: "Internal Server error" });
});

module.exports = app;
