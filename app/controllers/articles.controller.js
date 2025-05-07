// const endpoints = require("../../endpoints.json");
const {
  selectArticleById,
  selectArticles,
  selectComments,
  updateArticles,
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
  const {sort_by, order, topic } = req.query




  return selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  return selectComments(article_id)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchArticles = (req, res, next) => {
  const {article_id } = req.params;
  const {inc_votes } = req.body;

  return updateArticles(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
