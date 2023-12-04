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
    ...cards.slice(0, users.length * 2).map(({ card_id }, index) => ({
      card_id,
      game_id: gameId,
      user_id: users[index % users.length].user_id,
      user_sid: users[index % users.length].sid,
    })),
    ...cards.slice(4, 7).map(({ card_id }, index) => ({
      card_id,
      game_id: gameId,
      user_id: -3,
      user_sid: "Dealer_cards_FLOP3",
    })),
    ...cards.slice(7, 8).map(({ card_id }, index) => ({
      card_id,
      game_id: gameId,
      user_id: -2,
      user_sid: "Dealer_cards_TURN",
    })),
    ...cards.slice(8, 9).map(({ card_id }, index) => ({
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

  // const query_Flop = pgp.helpers.update(FlopCards, columns, "game_cards") +
  // "WHERE v.card_id::integer=t.card_id AND v.game_id::integer=t.game_id";

  // const query_turn = pgp.helpers.update(TurnCards, columns, "game_cards") +
  // "WHERE v.card_id::integer=t.card_id AND v.game_id::integer=t.game_id";

  // const query_river = pgp.helpers.update(RiverCards, columns, "game_cards") +
  // "WHERE v.card_id::integer=t.card_id AND v.game_id::integer=t.game_id";

  return db.none(query).then((_) => dealtCards);
};

module.exports = { dealCards };

/*

const dealtCards = [
  ...cards.slice(0, users.length * 2).map(({ card_id }, index) => ({
    card_id,
    game_id: gameId,
    user_id: users[index % users.length].user_id,
    user_sid: users[index % users.length].sid,
  })),
  ...cards.slice(4, 7).map(({ card_id }, index) => ({
    card_id,
    game_id: gameId,
    user_id: -3,
    user_sid: 'Dealer_cards_FLOP3',
  })),
  ...cards.slice(7, 8).map(({ card_id }, index) => ({
    card_id,
    game_id: gameId,
    user_id: -2,
    user_sid: 'Dealer_cards_TURN',
  })),
  ...cards.slice(8, 9).map(({ card_id }, index) => ({
    card_id,
    game_id: gameId,
    user_id: -1,
    user_sid: 'Dealer_cards_RIVER',
  }))
];


*/
