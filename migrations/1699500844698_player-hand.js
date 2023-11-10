exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("player_hand", {
    id: "id",
    player_id: {
      type: "int",
      references: "game_users",
    },
    card1: {
      type: "int",
      references: "cards",
    },
    card2: {
      type: "int",
      references: "cards",
    },
    player_order: {
      type: "int",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("player_hand");
};
