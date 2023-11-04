exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("player_hand", {
    id: {
      type: "int",
      primaryKey: true,
    },
    hand_id: {
      type: "int",
      references: {
        model: "bets",
        key: "id",
      },
    },
    flop: {
      type: "varchar(10)",
      references: {
        model: "cards",
        key: "id",
      },
    },
    turn: {
      type: "varchar(10)",
      references: {
        model: "cards",
        key: "id",
      },
    },
    river: {
      type: "varchar(10)",
      references: {
        model: "cards",
        key: "id",
      },
    },
    winner: {
      type: "int",
    },
    loser: {
      type: "int",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("player_hand");
};
