const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");



const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
  .query(`DROP TABLE IF EXISTS comments `)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics`)
  })
  .then(() => {
    return db.query(`CREATE TABLE topics(slug VARCHAR PRIMARY KEY, description VARCHAR(200),
      img_url VARCHAR(1000))`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users(username VARCHAR PRIMARY KEY, name VARCHAR(100),
      avatar_url VARCHAR(1000))`)
  })
  .then(() => {
    return db.query(`CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR(200),
      topic VARCHAR REFERENCES topics(slug), author VARCHAR REFERENCES users(username),
       body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0,
       article_img_url VARCHAR(1000))`)
  })
  .then(() => {
    return db.query(`CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id),
      body TEXT NOT NULL, votes INT DEFAULT 0, author VARCHAR(100) REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)
  })
  .then(() => {
    const formattedTopic = topicData.map((topic)=>{
      return [topic.slug, topic.description, topic.img_url];
    })
    const insertTopicQuery = format(
      `INSERT INTO topics (slug, description, img_url) VALUES %L`, formattedTopic
    );
    return db.query(insertTopicQuery);
  })
  .then(() =>{
    const formattedUser = userData.map((user) =>{
      return [user.username, user.name, user.avatar_url];
    })
    const insertUserQuery = format(
      `INSERT INTO users (username, name, avatar_url) VALUES %L`,
      formattedUser
    );
    return db.query(insertUserQuery)
  })
  .then(()=>{
    const formattedArticle = articleData.map((article) =>{

      const articleTimes = convertTimestampToDate(article);

      return [articleTimes.title, articleTimes.topic, articleTimes.author, articleTimes.body, articleTimes.created_at, articleTimes.votes, articleTimes.article_img_url];
    });
    const insertArticleQuery = format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedArticle
    );
    return db.query(insertArticleQuery)
  })
  .then((result) =>{
    const articleRefObject = createRef(result.rows);
    const formattedComments = commentData.map((comment)=>{
      const legitComment = convertTimestampToDate(comment);
      return [
        articleRefObject[comment.article_title],
        legitComment.body,
        legitComment.votes,
        legitComment.author,
        legitComment.created_at,
      ];
    })
    const insertCommentQuery = format(
      `INSERT INTO comments (article_id, body, votes, author, created_at)
      VALUES %L`,
      formattedComments
    );
    return db.query(insertCommentQuery)
  })
};







module.exports = seed;
