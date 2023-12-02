//const pg = require("pg-promise/typescript/pg-subset");

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createType("card_suits", ["hearts", "diamonds", "spades", "clubs"]);
  pgm.createTable("cards", {
    id: "id",
    suit: {
      type: "card_suits",
    },
    number: {
      //prof uses value on lec
      type: "int",
    },
  });

  const sql = "INSERT INTO cards (suit, number) VALUES";
  const cardValues = [];

  const suits_type = ["hearts", "diamonds", "spades", "clubs"];

  for (const suit_card of suits_type) {
    for (let number_type = 1; number_type <= 13; number_type++) {
      cardValues.push(`('${suit_card}', ${number_type})`);
    }
  }

  const query = `${sql} ${cardValues.join(",")}`;
  pgm.sql(query);
};

exports.down = (pgm) => {
  pgm.dropTable("cards");
  pgm.dropType("card_suits");
};
