const database = require("../connection");
const { connection: db, pgp } = database;

const UPDATE_DECK =
  "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3";

const dealCards = (users, cards, gameId) => {
  // Array of { card_id, user_id, game_id }
  // Map function iterates through the array, performs some operation and outputs a new array
  // iterate through the cards array, and extract the card_id
  // the dealtCards is an array that contains the 4 fields below.

  const dealtCards = [
    ...cards.slice(0, (users.length-3) * 2).map(({ card_id }, index) => ({
      card_id,
      game_id: gameId,
      user_id: users[index % (users.length-3)].user_id,
      user_sid: users[index % (users.length-3)].sid,
    })),
    ...cards.slice((users.length-3)*2, ((users.length-3)*2 +3)).map(({ card_id }, index) => ({
      card_id,
      game_id: gameId,
      user_id: -3,
      user_sid: "Dealer_cards_FLOP3",
    })),
    ...cards.slice(((users.length-3)*2 +3), ((users.length-3)*2 +4)).map(({ card_id }, index) => ({
      card_id,
      game_id: gameId,
      user_id: -2,
      user_sid: "Dealer_cards_TURN",
    })),
    ...cards.slice(((users.length-3)*2 +4), ((users.length-3)*2 +5)).map(({ card_id }, index) => ({
      card_id,
      game_id: gameId,
      user_id: -1,
      user_sid: "Dealer_cards_RIVER",
    })),
  ];

  console.log("THIS IS THE BIG DEALT CARD HERE");
  console.log(dealtCards);
  // const dealtCards = cards.slice(0, users.length * 2)
  // .map(({ card_id }, index) => ({
  //   card_id,
  //   game_id: gameId,
  //   user_id: users[index % users.length].user_id,
  //   user_sid: users[index % users.length].sid,
  // }));

  // const FlopCards = cards.slice(4, 7)
  // .map(({ card_id }, index) => ({
  //   card_id,
  //   game_id: gameId,
  //   user_id: -3,
  //   user_sid: 'Dealer cards',
  // }));

  // const TurnCards = cards.slice(7,8)
  // .map(({ card_id }, index) => ({
  //   card_id,
  //   game_id: gameId,
  //   user_id: -2,
  //   user_sid: 'Dealer cards',
  // }));

  // const RiverCards = cards.slice(8,9)
  // .map(({ card_id }, index) => ({
  //   card_id,
  //   game_id: gameId,
  //   user_id: -1,
  //   user_sid: 'Dealer cards',
  // }));

  const columns = new pgp.helpers.ColumnSet([
    "?game_id",
    "?card_id",
    "user_id",
  ]);
  const query =
    pgp.helpers.update(dealtCards, columns, "game_cards") +
    "WHERE v.card_id::integer=t.card_id AND v.game_id::integer=t.game_id";

  return db.none(query).then((_) => dealtCards);
};

module.exports = { dealCards };

