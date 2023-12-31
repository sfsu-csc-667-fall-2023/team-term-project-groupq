const authentication = require("./authentication");
const game = require("./game");
const landing = require("./landing");
const lobby = require("./global_lobby");
const chat = require("./chat");
const rules = require("./rules");
const match_end = require("./match_end");
const create_game = require("./create_game");

module.exports = {
  authentication,
  game,
  landing,
  lobby,
  chat,
  rules,
  match_end,
  create_game
};
