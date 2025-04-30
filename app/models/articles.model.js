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
    .query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY articles.created_at DESC`)
    .then((result) => {
        
        return result.rows
    })
}

// exports.selectArticles = (sort_by = "created_at", order = "DESC") => {
//     const validColumns = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url", "comment_count"]
//     const validOrders = ["ASC", "DESC"]
    
//     if(!validColumns.includes(sort_by)) {
//         return Promise.reject({status: 400, msg: "Invalid sort_by column"})
//     }
//     if(!validOrders.includes(order)){
//         return Promise.reject({status: 400, msg: "Invalid order value"})
//     }





    
//     const queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
//     COUNT (comments.article_id) AS comment_count
//     FROM articles
//     LEFT JOIN comments ON comments.article_id = articles.article_id
//     GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
//     ORDER BY articles.created_at DESC
//     ORDER BY ${sort_by} ${order}`;
   
        
//         return db.query(queryStr).then((result) =>result.rows)
    
// }