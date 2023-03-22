const express = require("express");
const harperUpdateUserRooms = require("../services/harper-update-user-rooms");
const harperGetUser = require("../services/harper-get-user");
const dataRouter = express.Router();
dataRouter.use(express.json());
dataRouter.use(express.urlencoded());

// Get user rooms
dataRouter.get("/rooms/:user", async (req, res) => {
  try {
    let user = req.params.user;
    let harperUser = await harperGetUser(user);
    let rooms = harperUser.rooms;
    res.status(200).send({
      success: true,
      payload: {
        rooms,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({ success: false, msg: "Backend error" });
  }
});

dataRouter.post("/rooms/add", async (req, res) => {
  try {
    let user = req.body.user;
    let rooms = req.body.rooms;
    let harperUser = await harperGetUser(user);

    // Id needed to update data row
    let recordId = harperUser.id;

    await harperUpdateUserRooms(recordId, rooms);
    res.status(200).send({
      success: "true",
      payload: {
        rooms: rooms,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).send({
      success: "false",
      msg: "Backend error",
    });
  }
});

module.exports = dataRouter;
