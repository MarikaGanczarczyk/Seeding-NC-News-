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
        topics.forEach((topic) =>{
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
            
          });
        })
      });
  });
});
