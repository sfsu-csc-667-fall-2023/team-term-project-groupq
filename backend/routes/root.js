const express = require("express");
const router = express.Router();
router.get("/", (_request, response) => {
  const name = "My name";
  response.render("root", { name });
});

module.exports = router;
