require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const crypto = require("crypto");

// Check if user in db
async function userExists(username) {
  //
  //
}

// Check if password matches hash
async function compareToHash(plainPassword, hashedPassword) {
  // COMPARE LOGIN PASSWORD WITH DATABASE HASH
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

// Generate hash from plain password
function generateHash(plainPassword) {
  // CREATE HASHED PASSWORD ON REGISTER EVENT
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword, salt);
  return hash;
}

// Generate accesstoken
function generateAccessToken(username) {
  // GENERATE ACCESS TOKEN ON LOGIN & REGISTER EVENTS
  const token = jwt.sign(
    { username: username },
    process.env.ACCESS_TOKEN_SECRET
  );
  return token;
}

module.exports = {
  userExists,
  compareToHash,
  generateAccessToken,
  generateHash,
};
