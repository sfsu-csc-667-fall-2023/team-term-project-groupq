const express = require("express");
const { Games } = require("../db");
const router = express.Router();

router.get("/", async (request, response) => {
  const { id: userId, username } = request.session.user;
  const availableGames = await Games.getAvailableGames(); // NEED TO CHECK THIS!
  const activePlayers = await Games.getActivePlayers();
  const returningGames = await Games.getLeftGames(userId);

  response.render("global_lobby", { availableGames, activePlayers, returningGames });
});

module.exports = router;
