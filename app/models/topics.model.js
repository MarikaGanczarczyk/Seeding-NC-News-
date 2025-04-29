const db = require("../../db/connection");
const endpoints = require("../../endpoints.json");

const selectApi = () => {
  return endpoints
  
};
const selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

module.exports = { selectApi, selectTopics };
