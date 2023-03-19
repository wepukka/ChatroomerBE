const express = require("express");
const authRouter = express.Router();

// Middleware
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");

// Harper
const HarperSaveUser = require("../services/harper-save-user");
const HarperGetUser = require("../services/harper-get-user");
const { HarperDescribeTable } = require("../services/harper-describe");

// Controllers
const {
  generateHash,
  compareToHash,
  generateAccessToken,
} = require("../controllers/auth.controller");

authRouter.use(express.json());
authRouter.use(express.urlencoded());

// Register
authRouter.post("/register/", async (req, res) => {
  try {
    let user = req.body.user;
    let password = req.body.password;

    // Check db for users
    let harperUser = await HarperGetUser(user);

    if (harperUser !== undefined) {
      return res.status(404).send({
        success: false,
        msg: "Username taken",
      });
    }

    // Create hash
    let hash = generateHash(password);

    // Save user to db
    await HarperSaveUser(user, hash);

    // Success
    res.status(200).send({
      token: generateAccessToken(user),
      success: true,
      username: user,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      msg: "Backend error",
    });
  }
});

// Login
authRouter.post("/login/", async (req, res) => {
  try {
    let user = req.body.user;
    let password = req.body.password;

    // Check db for users
    let harperUser = await HarperGetUser(user);

    if (harperUser === undefined) {
      return res.status(404).send({
        success: false,
        msg: "Invalid login",
      });
    }

    // Check if password matches hash in db
    let validPassword = await compareToHash(password, harperUser.hash);

    // Invalid password
    if (!validPassword) {
      return res.status(404).send({
        success: false,
        msg: "Invalid login",
      });
    }

    // Success
    return res.status(200).send({
      success: true,
      user: user.username,
      accessToken: generateAccessToken(user),
    });
  } catch (err) {
    return res.send({
      success: "false",
      msg: "Backend error",
    });
  }
});

// Authenticate
authRouter.post("/authenticate", verifyAccessToken, async (req, res) => {
  res.status(200).send({
    user: req.user,
    success: true,
  });
});

module.exports = authRouter;
