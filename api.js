const express = require("express");
const db = require("./db/connection");
const { getApi, getTopics } = require("./app/controllers/topics.controller");
const {getArticlesID }= require("./app/controllers/articles.controller");
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesID);


app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
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
