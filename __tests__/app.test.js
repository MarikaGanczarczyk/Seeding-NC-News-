const endpointsJson = require("../endpoints.json");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

const request = require("supertest");

const app = require("../api");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("Incorrect path", () => {
  test("404 - responds with error for invalid path", () => {
    return request(app)
      .get("/api/noexist")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200, responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
        expect(topics[0] instanceof Object).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
describe("GET article by id", () => {
  test("200: responds with article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400- Bad request when passed an ivalid article_id", () => {
    return request(app)
      .get("/api/articles/notNum")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: article_id does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article id is not found");
      });
  });
});

describe("GET articles", () => {
  test("200: responds with all articles", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("responds with an array containing all og the articles", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles[0] instanceof Object).toBe(true);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: OK if sort_by query is created_at and is sorted correctly", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET comments by article id", () => {
  test("200 - responds with array of comments for given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("404: article_id does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article id is not found");
      });
  });
  test("400: responds with error if article_id is invalid", () => {
    return request(app)
      .get("/api/articles/notaNum/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST comments", () => {
  test("200 responds with newly added comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(200)
      .then(({ body }) => {
        expect(body.newComment).toMatchObject({
          author: "butter_bridge",
          body: "new comment",
          created_at: expect.any(String),
          votes: 0,
          article_id: 1,
          comment_id: expect.any(Number),
        });
      });
  });
  // test("404: Responds with not found when article out of range", () => {
  //   const newComment = {
  //     username: "butter_bridge",
  //     body: "new comment",
  //   };
  //   return request(app)
  //     .post("/api/articles/1000/comments")
  //     .send(newComment)
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Not found");
  //     });
  // });
  // test("404: Responds with not found when author is invalid", () => {
  //   const newComment = {
  //     username: "Marika",
  //     body: "new comment",
  //   };
  //   return request(app)
  //     .post("/api/articles/1000/comments")
  //     .send(newComment)
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Not found");
  //     });
  // });
  test("400: responds with Bad request when passing invalid id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "new comment",
    };
    return request(app)
      .post("/api/articles/notNum/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("PATCH/api/articles/:article_id", () => {
  test("200: Responds with updated article ", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 1,
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: responds with Not found if article_id doesn't exist", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: responds with bad request if invalid article_id", () => {
    return request(app)
      .patch("/api/articles/notNum")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content for given comment id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });

  test("400: Responds with Bad Request if given invalid comment id", () => {
    return request(app)
      .delete("/api/comments/notNum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with Not Found if given comment id that is out of range", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
describe("GET api/users", () => {
  test("200: responds with an array of users ojects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds with error if endpoints doesn't exist", () => {
    return request(app)
      .get("/api/noexist")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles -sorting by queries", () => {
  test("200: Responds with sorted articles by title (discending)", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("title", { descending: true });
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });
  test("200: Responds with sorted articles by topic (discending)", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("topic", { descending: true });
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });
  test("200: Responds with sorted articles by created_at (discending)", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });
  test("200: Responds with sorted articles by topic in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("topic", { descending: false });
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });
});
describe("GET /api/articles -sorting by queries(Error handling)", () => {
  test("400 : responds with error when column does not exist", () => {
    return request(app)
      .get("/api/articles?sort_by=noExist")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 : responds with error when order value is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=inalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/articles (topic query)", () => {
  test("200: responds with filtered artciles by specified topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
      

        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200 : respond with an empty array if there is no valid topic", ()=>{
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(response =>{
      expect(response.body.articles).toEqual([])
    })
  })
});
describe("GET /api/articles (topic query) - error handling", ()=>{
  test("400: responds with an error when bad request", ()=>{
   return request(app)
     .get("/api/articles/topic=flower")
     .expect(400)
     .then(response =>{
       expect(response.body.msg).toEqual("Bad request")
     })
  })
 })




describe("GET /api/articles/:article_id (comment count", () => {
  test("200 : responds with article with comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.title).toBe("Living in the shadow of a great man"),
          expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);

        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(11);
      });
  });
  test("200 : responds with article with no comment count", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.title).toBe("Sony Vaio; or, The Laptop"),
          expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.");
        expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
        expect(article.votes).toBe(0);

        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(0);
      });
  });
  test("404: responds with Not found if article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/1000")
      
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article id is not found");
      });
  });
  test("400: responds with bad request if invalid article_id", () => {
    return request(app)
      .get("/api/articles/notNum")
      
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
