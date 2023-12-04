const database = require("../connection");
const { connection: db } = database;

const GET_CARDS_ALREADY_DEALT = `
  SELECT * FROM game_cards, cards
  WHERE (game_cards.game_id=$1) AND (game_cards.card_id=cards.id) AND (game_cards.user_id!=0)
`;

const getCardsAlreadyDealt = (gameId) =>
  db.any(GET_CARDS_ALREADY_DEALT, [gameId]);

module.exports = { getCardsAlreadyDealt };
