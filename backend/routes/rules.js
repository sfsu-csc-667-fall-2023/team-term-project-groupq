const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
  response.render("rules");
});

module.exports = router;
