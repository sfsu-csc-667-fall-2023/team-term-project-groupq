exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createType("stages", ["preflop", "flop", "turn", "river"]);
  pgm.createTable("games", {
    id: {
      type: "int",
      primaryKey: true,
    },
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
      references: {
        model: "cards",
        key: "id",
      },
    },
    flop2: {
      type: "int",
      references: {
        model: "cards",
        key: "id",
      },
    },
    flop3: {
      type: "int",
      references: {
        model: "cards",
        key: "id",
      },
    },
    turn: {
      type: "int",
      references: {
        model: "cards",
        key: "id",
      },
    },
    river: {
      type: "int",
      references: {
        model: "cards",
        key: "id",
      },
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
  pgm.dropType("stages");
  pgm.dropTable("games");
};
