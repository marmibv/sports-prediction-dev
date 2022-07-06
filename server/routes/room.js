const router = require("express").Router();
const { check } = require("express-validator");
const authenticate = require("../middleware/authenticate");
const canViewRoom = require("../middleware/can-access-room");
const roomController = require("../controllers/roomController");


//Route for adding a new room
router.post("/new", authenticate, [
    check("name", "Please provide a room name").notEmpty(),
    check("tournament", "Please provide a tournament").notEmpty()
], roomController.new)

//Route for joining a room. Room ID comes in with request body
router.post("/:id/join", authenticate, roomController.join);

//Route for searching room based on it's key
router.get("/:key/joindata", authenticate, roomController.findByKey)

//Route for getting all rooms the user is in
router.get("/:username/all", authenticate, roomController.all);

//Route for getting all users in rooms
router.get("/members", authenticate, canViewRoom, roomController.roomUsers);


module.exports = router;