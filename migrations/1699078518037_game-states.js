exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("game_states", {
    player_id: {
      type: "int",
      references: {
        model: "game_users",
        key: "player_id",
      },
    },
    game_id: {
      type: "int",
      references: {
        model: "games",
        key: "id",
      },
    },
    table_id: {
      type: "int",
      references: {
        model: "table_state",
        key: "id",
      },
    },
    game_phase: {
      type: "phase",
    },
  });
  pgm.createType("phase", ["preflop", "flop", "turn", "river"]);
};

exports.down = (pgm) => {
  pgm.dropTable("game_states");
  pgm.dropType("phase");
};
