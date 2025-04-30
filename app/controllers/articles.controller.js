// const endpoints = require("../../endpoints.json");
const {
  selectArticleById,
  selectArticles,
} = require("../models/articles.model");

exports.getArticlesID = (req, res, next) => {
  const article_id = req.params.article_id;

  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
    return selectArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}