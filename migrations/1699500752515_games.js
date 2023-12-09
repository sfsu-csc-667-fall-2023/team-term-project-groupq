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
    starting_chips: {
      type: "int",
    },
    pot_count: {
      type: "int",
    },
    round_winner: {
      type: "int",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("games", "game_phase");
  pgm.dropType("stages");
  pgm.dropTable("games");
};
