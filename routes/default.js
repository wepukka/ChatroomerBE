const express = require("express");
const defaultRouter = express.Router();

defaultRouter.use(express.json());
defaultRouter.use(express.urlencoded());

defaultRouter.get("/", async (req, res) => {
  res.status(200).send({
    message: "Default route",
  });
});

module.exports = defaultRouter;
