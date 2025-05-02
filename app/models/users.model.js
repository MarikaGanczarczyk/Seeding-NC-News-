const db = require("../../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};


// describe("GET /api/topics", () => {
//   test("200, responds with an array of topic objects", () => {
//     return request(app)
//       .get("/api/topics")
//       .expect(200)
//       .then(({ body: { topics } }) => {
//         expect(Array.isArray(topics)).toBe(true);
//         expect(topics.length).toBe(3);
//         expect(topics[0] instanceof Object).toBe(true);
//         topics.forEach((topic) => {
//           expect(topic).toMatchObject({
//             slug: expect.any(String),
//             description: expect.any(String),
//           });
//         });
//       });
//   });