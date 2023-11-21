const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { Games, Users } = require("../db")

router.get("/create", async (request, response) => {

  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
  );
  await Games.addUser(userId, gameId);

  io.emit("game:created", { id: gameId });

  response.redirect(`/games/${gameId}`);
});

router.get("/:id/join", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username: user } = request.session.user;
  const io = request.app.get("io");

  await Games.addUser(userId, gameId);
  io.emit("game:user_added", { userId, user, gameId });

  response.redirect(`/games/${gameId}`);
});


router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const { game_socket_id: gameSocketId } = await Games.getGame(id); // game_socket_id is a row obtained from the postgresql table

  //const result = await Users.getUserSocket(request.session.id);
  //console.log(result)

  response.render("game", { id, gameSocketId });
});

module.exports = router;
