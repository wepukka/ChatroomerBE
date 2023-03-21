const express = require("express");
const harperGetUser = require("../services/harper-get-user");
const dataRouter = express.Router();
dataRouter.use(express.json());
dataRouter.use(express.urlencoded());

// Register
dataRouter.get("/rooms/:user", async (req, res) => {
  req.params.user;
  let harperUser = harperGetUser(user);
  console.log(harperUser);
  res.send("Rooms");
});

module.exports = dataRouter;
