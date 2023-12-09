const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/games");

router.get("/", (_request, response) => {

  response.render("create_game");
});

router.post("/", async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { max_players, start_chip } = request.body;

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
  );

   await Games.addUser(userId, gameId);
   await Games.setStartingChip(gameId, start_chip);
   await Games.setStartingPlayersAllowed(gameId, max_players);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId });

  response.redirect(`/games/${gameId}`);
});

module.exports = router;
