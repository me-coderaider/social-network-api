const express = require("express");
const userRepo = require("../repos/user-repo");
const router = express.Router();

router.get("/users", async (req, res) => {
  // for each route we've to perform 2 things
  // 1. Run a query as per the route.
  // 2.Send the result back to the person who made the request.
  const users = await userRepo.find();
  res.send(users);
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await userRepo.findById(id);

  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

router.post("/users", async (req, res) => {
  const { username, bio } = req.body;

  const user = await userRepo.insert(username, bio);
  res.send(user);
});

router.put("/users/:id", async (req, res) => {});

router.delete("/users/:id", async (req, res) => {});

module.exports = router;
