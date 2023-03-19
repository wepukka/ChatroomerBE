require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const crypto = require("crypto");

module.exports = {
  name: "authControllers",
  description: "Controllers for authentication",
  async userExists(username) {
    //
    //
  },
  async passwordIsValid(plainPassword, hashedPassword) {
    // COMPARE LOGIN PASSWORD WITH DATABASE HASH
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  },
  generateHash(plainPassword) {
    // CREATE HASHED PASSWORD ON REGISTER EVENT
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
  },
  generateAccessToken(username) {
    // GENERATE ACCESS TOKEN ON LOGIN & REGISTER EVENTS
    const token = jwt.sign(
      { username: username },
      process.env.ACCESS_TOKEN_SECRET
    );
    return token;
  },
};
