const pg = require("pg-promise/typescript/pg-subset");

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  //pgm.createType("suits", ["hearts", "diamonds", "spades", "clubs"]);
  pgm.createTable("cards", {
    id: "id",
    number: { //prof uses value on lec
      type: "int",
    },
    suit: {
      type: "int",
      //type: "suits",
    },
  });

  const sql = "INSERT INTO cards (suits, number) VALUES";
  const number = [];

  for(let suit = 0; suit < 4; suit++) {
    for(let number = 1; number <= 13; number++) {
      number.push(`(${suit}, ${number})`);
    }
  }

  const query = `${sql} ${number.join(",")}`
  pgm.sql(query);
};

exports.down = (pgm) => {
  pgm.dropTable("cards");
  //pgm.dropType("suits");
};
