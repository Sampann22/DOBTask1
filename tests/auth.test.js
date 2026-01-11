const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `test${Date.now()}@test.com`,
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.referralCode).toBeDefined();
  }, 10000); // extended timeout
});
