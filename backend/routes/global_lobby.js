const express = require("express");
const router = express.Router();
router.get("/global_lobby", (_request, response) => {
  response.render("global_lobby");
});

module.exports = router;
