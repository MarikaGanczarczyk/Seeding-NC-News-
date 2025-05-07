const db = require("../../db/connection");

exports.selectArticleById = (article_id) => {
  return db

    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.body, articles.author, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count FROM articles
      LEFT JOIN comments on comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`, [article_id])
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

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_id",
    'article_img_url'
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!validOrder.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
   `;

    const queryValue = [];

    if (topic){
      queryValue.push(topic)
      queryStr += `WHERE articles.topic = $1`;
    }
    queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`

  return db.query(queryStr, queryValue).then((result) => {
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
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )

    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};
