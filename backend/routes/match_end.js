const express = require("express");
const router = express.Router();

router.get("/:id/match_end", (request, response) => {
  const { id } = request.params;
  response.render("match_end", { id });
});

module.exports = router;
