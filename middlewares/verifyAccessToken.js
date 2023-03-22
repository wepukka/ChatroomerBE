const jwt = require("jsonwebtoken");

module.exports = {
  name: "Access",
  descrtiption: "Checks if user has valid AccessToken",
  verifyAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === undefined || token === "undefined" || token === null) {
      return res.send({ message: "No token", success: false });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  },
};
