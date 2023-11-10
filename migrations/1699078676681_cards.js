exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createType("suits", ["hearts", "diamonds", "spades", "clubs"]);
  pgm.createTable("cards", {
    id: "id",
    number: {
      type: "int",
    },
    suit: {
      type: "suits",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("cards");
  pgm.dropType("suits");
};
