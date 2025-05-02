const db = require("../../db/connection");

exports.selectArticleById = (article_id) => {
  return db

    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article id is not found",
        });
      }

      return result.rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY articles.created_at DESC`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectComments = (article_id) => {
  return db
    .query(
      `SELECT 
                comment_id, votes, created_at, author, body, article_id
             FROM 
                comments
             WHERE 
                article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article id is not found",
        });
      }

      return result.rows;
    });
};

exports.updateArticles = (article_id, inc_votes) => {
  return db
  .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, 
  [inc_votes, article_id])

  .then((result) => {
      if (result.rows.length === 0) {
          return Promise.reject({status: 404, msg: "Not Found"})
      }
      return result.rows[0]
  })
};
