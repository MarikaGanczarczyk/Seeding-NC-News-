const { insertComment } = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((newComment) => {
      res.status(200).send({ newComment });
    })

    .catch((err) => {
      if (err.code === "23503") {
        next({ status: 404, msg: "Not found" });
      }

      next(err);
    });
};
