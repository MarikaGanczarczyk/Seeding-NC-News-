const { insertComment, removeComment } = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((newComment) => {
      res.status(200).send({ newComment });
    })

    .catch((err) => {
      if (err.code === "23503") {
        next({ status: 404, msg: {article_id, username, body} });
      }

      next(err);
    });
};
exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params
  
  console.log(comment_id);
  

 removeComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}