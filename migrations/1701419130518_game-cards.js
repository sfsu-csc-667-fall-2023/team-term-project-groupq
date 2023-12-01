/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("game_cards", {
    user_id: {
      type: "int",
      references: "users",
    },
    game_id: {
      type: "int",
      references: "games",
    },
    card_id: {
      type: "int",
      references: "cards",
    },
  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.down = (pgm) => {
  pgm.dropTable("game_cards");
};
