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
        console.log(response.body.msg);

        expect(response.body.msg).toBe("Path not found");
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
      .then(({body: {msg}}) => {
       
        expect(msg).toBe("Bad request");
      });
  });
  test("404: article_id does not exist", ()=>{
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body: {msg}}) => {
      
      expect(msg).toBe("article id is not found");
    });
  }
  )
});
