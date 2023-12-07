const express = require("express");
const { Games } = require("../db");
const router = express.Router();

router.get("/", async (_request, response) => {
  const availableGames = await Games.getAvailableGames(); // NEED TO CHECK THIS!
  const activePlayers = await Games.getActivePlayers();

  response.render("global_lobby", { availableGames, activePlayers });
});

module.exports = router;
