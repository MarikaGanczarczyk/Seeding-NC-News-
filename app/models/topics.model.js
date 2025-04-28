const db = require("../../db/connection");
const endpoints = require("../../endpoints.json");

const selectApi = () => {
    return new Promise((resolve, reject) =>{
        resolve(endpoints)
    })
  
};



module.exports = { selectApi };
