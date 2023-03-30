require("dotenv").config();
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require("./services/harper-get-messages");
const { leaveRoom } = require("./utils");
const { Server } = require("socket.io");

function SocketServer(server) {
  // Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const CHAT_BOT = "ChatBot";
  let chatRoom = "";
  let allUsers = [];

  // Listen for when the client connects via socket.io-client
  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.emit("all_users", allUsers);

    // Add a user to a room
    socket.on("join_room", (data) => {
      const { username, room } = data; // Data sent from client when join_room event emitted
      socket.join(room); // Join the user to a socket room

      let __createdtime__ = Date.now(); // Current timestamp
      // Send message to all users currently in the room, apart from the user that just joined
      socket.to(room).emit("receive_message", {
        message: `${username} has joined the chat room`,
        username: CHAT_BOT,
        __createdtime__,
      });

      chatRoom = room;

      // Show current users in the room
      allUsers.push({ id: socket.id, username, room });
      chatRoomUsers = allUsers.filter((user) => user.room === room);
      socket.to(room).emit("chatroom_users", chatRoomUsers);
      socket.emit("chatroom_users", chatRoomUsers);

      harperGetMessages(room)
        .then((last1000Messages) => {
          //
          // If no messages in the room, inform user
          if (JSON.parse(last1000Messages).length === 0) {
            socket.emit("receive_message", {
              message: "No messages in this room, be the first one to chat!",
              username: CHAT_BOT,
              __createdtime__,
            });
          }
          socket.emit("last_1000_messages", last1000Messages);
        })
        .catch((err) => console.log(err));
    });

    // User leaves a room
    socket.on("leave_room", (data) => {
      const { username, room } = data;
      socket.leave(room);
      const __createdtime__ = Date.now();
      // Remove user from memory
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(room).emit("chatroom_users", allUsers);
      socket.to(room).emit("receive_message", {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        __createdtime__,
      });
      console.log(`${username} has left the chat`);
    });

    // User gets disconnected from a room
    socket.on("disconnect", () => {
      console.log("User disconnected from the chat");
      const user = allUsers.find((user) => user.id == socket.id);
      if (user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(chatRoom).emit("chatroom_users", allUsers);
        socket.to(chatRoom).emit("receive_message", {
          message: `${user.username} has disconnected from the chat.`,
        });
      }
    });

    // Send message to server
    socket.on("send_message", (data) => {
      const { message, username, room, __createdtime__ } = data;
      io.in(room).emit("receive_message", data); // Send to all users in room, including sender
      harperSaveMessage(message, username, room, __createdtime__) // Save message in db
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    });
  });
}

module.exports = SocketServer;
