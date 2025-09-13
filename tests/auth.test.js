const request = require("supertest");
const app = require("../index");

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not register with invalid email", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "invalidemail",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should login an existing user", async () => {
    await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "password123"
    });

    expect(res.body).toHaveProperty("token");
  });

  it("should verify credentials of an existing user", async () => {
    await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/auth/verify").send({
      username: "testuser",
      password: "password123"
    });

    expect(res.body).toHaveProperty("verified");
    expect(res.body.verified).toBe(true);
  });
});
