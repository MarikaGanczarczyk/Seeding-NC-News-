const db = require("../../db/connection");
const endpoints = require("../../endpoints.json");

exports.selectApi = () => {
  return endpoints
  
};
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};


