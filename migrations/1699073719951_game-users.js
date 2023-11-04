exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("game_users", {
    player_id: {
      type: "int",
    },
    turn_order: {
      type: "int",
    },
    chip_count: {
      type: "int",
    },
    left_game: {
      type: "boolean",
    },
    card1: {
      type: "int",
    },
    card2: {
      type: "int",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("game_users");
};
