const app = require("./api")

app.listen(9090, ()=>{
    console.log("app listening on port 9090")
})

const express = require("express");
// const app = express();

// // Middleware i endpointy tutaj

// app.listen(3000, () => {
//     console.log("Serwer działa na porcie 3000!");
// });

module.exports = app;
