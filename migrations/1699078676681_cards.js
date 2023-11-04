exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("cards", {
    id: {
      type: "int",
      primaryKey: true,
    },
    number: {
      type: "int",
    },
    suit: {
      type: "suits",
    },
  });
  pgm.createType("suits", ["hearts", "diamonds", "spades", "clubs"]);
};

exports.down = (pgm) => {
  pgm.dropTable("cards");
  pgm.dropType("suits");
};
