exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createType("stages", ["preflop", "flop", "turn", "river"]);
  pgm.createTable("games", {
    id: "id",
    players_allowed: {
      type: "int",
    },
    starting_chip: {
      type: "int",
    },
    active: {
      type: "boolean",
    },
    game_phase: {
      type: "stages",
    },

    flop1: {
      type: "int",
      references: "cards",
    },
    flop2: {
      type: "int",
      references: "cards",
    },
    flop3: {
      type: "int",
      references: "cards",
    },
    turn: {
      type: "int",
      references: "cards",
    },
    river: {
      type: "int",
      references: "cards",
    },
    small_blind: {
      type: "int",
    },
    big_blind: {
      type: "int",
    },
    pot_count: {
      type: "int",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    started_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("games", "game_phase");
  pgm.dropType("stages");
  pgm.dropTable("games");
};
