const express = require("express");
const db = require("./db/connection");
const getApi = require("./app/controllers/topics.controller");

const app = express();

app.use(express.json());

app.get("/api", getApi);






module.exports = app;
