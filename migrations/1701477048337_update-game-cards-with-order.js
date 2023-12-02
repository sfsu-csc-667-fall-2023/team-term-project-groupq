/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.addColumn("game_cards", { card_order: { type: "int" } });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.down = (pgm) => {
  pgm.dropColumn("game_cards", "card_order");
};
