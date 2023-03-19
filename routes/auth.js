const express = require("express");
const authRouter = express.Router();
const authController = require("../Controllers/auth.controller");
const { verifyAccessToken } = require("../Middleware/verifyAccessToken");
const HarperSaveUser = require("../services/harper-save-user");

authRouter.use(express.json());
authRouter.use(express.urlencoded());

authRouter.post("/register/", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // Check db if username already exists

  // Save user to db
  HarperSaveUser(username, password);

  // If success

  res.status(200).send({
    token: authController.generateAccessToken(username),
    success: true,
    username: user.username,
  });
});

authRouter.post("/login/", async (req, res) => {
  const INVALID_LOGIN = "Invalid username or password!";
  let username = req.body.username;
  let password = req.body.password;

  // Find username from db,
  // Compare password with hash from db

  const isValidPassword = await authController.passwordIsValid(
    password,
    user.password
  );

  // If password is valid return success, return failure

  return isValidPassword
    ? res.status(200).send({
        token: authController.generateAccessToken(username),
        success: true,
        username: user.username,
      })
    : res.send({
        message: INVALID_LOGIN,
        success: false,
      });
});

authRouter.post("/authenticate", verifyAccessToken, async (req, res) => {
  res.status(200).send({
    user: req.user,
    success: true,
  });
});

module.exports = authRouter;
