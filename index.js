require("dotenv").config();
const express = require("express");
const app = express();
http = require("http");
const cors = require("cors");
const SocketServer = require("./socket");

app.use(cors()); // Add cors middleware
const server = http.createServer(app);
SocketServer(server);

server.listen(4000, () => "Server is running on port 4000");
