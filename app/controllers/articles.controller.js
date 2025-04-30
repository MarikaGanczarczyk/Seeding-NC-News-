// const endpoints = require("../../endpoints.json");
const { selectArticleById } = require("../models/articles.model");



exports.getArticlesID = (req, res, next) => {
  const  article_id  = req.params.article_id;


  return selectArticleById(article_id)
    .then((article) => {
       
       
        
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
