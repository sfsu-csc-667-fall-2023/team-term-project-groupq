exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("table_state", {
    id: {
      type: "int",
      primaryKey: true,
    },
    game_id: {
      type: "int",
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
    players_remaining: {
      type: "int",
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
  });
};

exports.down = (pgm) => {
  pgm.dropTable("table_state");
};