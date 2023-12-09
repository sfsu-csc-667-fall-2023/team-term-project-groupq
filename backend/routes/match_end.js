const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
  response.render("match_end");
});

module.exports = router;
