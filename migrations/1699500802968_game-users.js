exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("game_users", {
    id: "id",
    user_id: {
      type: "int",
      references: "users",
    },
    game_id: {
      type: "int",
      references: "games",
    },
    is_ready: {
      type: "boolean",
    },
    current_player: {
      type: "int",
    },
    web_position: {
      type: "int",
    },
    chip_count: {
      type: "int",
    },
    left_game: {
      type: "boolean",
    },
    performed_action: {
      type: "boolean",
    },
    hand_score: {
      type: "int",
    },
    // created_at: {
    //   type: "timestamp",
    //   notNull: true,
    //   default: pgm.func("current_timestamp"),
    // },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("game_users");
};
