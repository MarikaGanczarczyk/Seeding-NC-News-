const express = require("express");
const db = require("./db/connection");
const { getApi, getTopics } = require("./app/controllers/topics.controller");

const app = express();

app.use(express.json());


app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all('/*splat', (req, res) =>{
    res.status(404).send({msg: "Path not found"})
})





module.exports = app;
