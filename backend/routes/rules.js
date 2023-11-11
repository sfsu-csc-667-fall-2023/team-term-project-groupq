const express = require("express");
const router = express.Router();
router.get("/rules", (_request, response) => {
  response.render("rules");
});

module.exports = router;
