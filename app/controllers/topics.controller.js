const endpoints = require("../../endpoints.json");

const { selectApi } = require("../models/topics.model");

const getApi = (req, res) => {
  return selectApi()
  .then((endpoints) => 
    res.status(200).send({ endpoints })
  )
};
  
 

module.exports = getApi;