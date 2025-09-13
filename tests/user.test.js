const request = require("supertest");
const app = require("../index");

describe("User API", () => {
  it("should update current user", async () => {
    const reg = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app)
      .put("/user")
      .set("Authorization", "Bearer " + reg.body.token)
      .send({
        height: 170,
        initialWeight: 70,
      });

    expect(res.statusCode).toBe(200);
  });

  it("should not update with an existing username", async () => {
    const userA = await request(app).post("/auth/register").send({
      username: "userA",
      email: "userA@example.com",
      password: "password123",
    });

    await request(app).post("/auth/register").send({
      username: "userB",
      email: "userB@example.com",
      password: "password123",
    });

    const res = await request(app)
      .put("/user")
      .set("Authorization", "Bearer " + userA.body.token)
      .send({
        username: "userB",
        height: 170,
        initialWeight: 70,
      });

    expect(res.statusCode).toBe(400);
  })
});
