exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("rounds", {
    id: {
      type: "int",
      primaryKey: true,
    },
    game_id: {
      type: "int",
    },
    winner: {
      type: "winner",
    },
    loser: {
      type: "timestamp",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("rounds");
};