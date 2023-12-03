const database = require("../connection");
const { connection: db } = database;

// const GET_CARDS = `
//   SELECT * FROM game_cards, cards
//   WHERE (game_cards.game_id=$1) AND (game_cards.card_id=cards.id) AND (game_cards.user_id!=0)
// `;

const GET_CARDS = `
  SELECT * FROM game_cards, cards
  WHERE game_cards.game_id=$1 AND game_cards.user_id=0 AND game_cards.card_id=cards.id
  ORDER BY game_cards.card_order LIMIT $2
`;

// const GET_CARDS =
//   "SELECT card_id FROM game_cards WHERE game_id=$1 AND user_id=0 ORDER BY card_order LIMIT $2";

const getCardsperPlayers = (gameId, limit) =>
  db.any(GET_CARDS, [gameId, limit]);

module.exports = { getCardsperPlayers };
