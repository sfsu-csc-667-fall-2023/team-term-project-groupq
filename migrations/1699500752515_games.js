exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createType("stages", ["preflop", "flop", "turn", "river"]);
  pgm.createTable("games", {
    id: "id",
    game_socket_id: {
      type: "varchar",
      notNull: true,
    },
    is_initialized: {
      type: "boolean",
    },
    players_allowed: {
      type: "int",
    },
    current_player: {
      type: "int",
    },
    game_phase: {
      type: "stages",
    },
    // flop1: {
    //   type: "int",
    //   references: "cards",
    // },
    // flop2: {
    //   type: "int",
    //   references: "cards",
    // },
    // flop3: {
    //   type: "int",
    //   references: "cards",
    // },
    // turn: {
    //   type: "int",
    //   references: "cards",
    // },
    // river: {
    //   type: "int",
    //   references: "cards",
    // },
    // small_blind: {
    //   type: "int",
    // },
    // big_blind: {
    //   type: "int",
    // },
    pot_count: {
      type: "int",
    },
    round_winner: {
      type: "int",
      references: "users",
    },
    // created_at: {
    //   type: "timestamp",
    //   notNull: true,
    //   default: pgm.func("current_timestamp"),
    // },
    // updated_at: {
    //   type: "timestamp",
    //   notNull: true,
    //   default: pgm.func("current_timestamp"),
    // },
    // started_at: {
    //   type: "timestamp",
    //   notNull: true,
    //   default: pgm.func("current_timestamp"),
    // },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("games", "game_phase");
  pgm.dropType("stages");
  pgm.dropTable("games");
};
