const db = require("../../db/connection");

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
exports.removeComment = (comment_id) => {
 
  
  return db
    .query(
        `DELETE FROM comments where comment_id = $1 RETURNING *`,
        [comment_id]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
    })
}