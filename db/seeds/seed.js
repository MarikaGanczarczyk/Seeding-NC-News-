const db = require("../connection")



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
};





module.exports = seed;
