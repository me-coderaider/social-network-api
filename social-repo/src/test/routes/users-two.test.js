// writing tests for users.js file
const request = require("supertest");
const buildApp = require("../../app");
const userRepo = require("../../repos/user-repo");
const pool = require("../../pool");
const context = require("../context");

let localContext;

beforeAll(async () => {
  localContext = await context.build();
});

afterAll(() => {
  return localContext.close();
});

it("create a user", async () => {
  const startingCount = await userRepo.count();
  //   expect(startingCount).toEqual(0);

  await request(buildApp())
    .post("/users")
    .send({ username: "testuser", bio: "test bio" })
    .expect(200);

  const finishCount = await userRepo.count();
  //   expect(finishCount).toEqual(1);
  expect(finishCount - startingCount).toEqual(1);
});
