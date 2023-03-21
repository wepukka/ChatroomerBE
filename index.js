require("dotenv").config();
const express = require("express");
const app = express();
http = require("http");
const cors = require("cors");
const SocketServer = require("./socket");

// Routes
app.use(cors()); // Add cors middleware
const defaultRouter = require("./routes/default");
const authRouter = require("./routes/auth");

const server = http.createServer(app);
SocketServer(server);

app.use("/", defaultRouter);
app.use("/api/auth", authRouter);

server.listen(4000, () => "Server is running on port 4000");
