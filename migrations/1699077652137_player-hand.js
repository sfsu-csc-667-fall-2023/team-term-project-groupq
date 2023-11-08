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
    player_id: {
      type: "int",
      references: {
        model: "game_users",
        key: "id",
      },
    },
    bet_id: {
      type: "int",
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
    card1: {
      type: "int",
      references: {
        model: "cards",
        key: "id",
      },
    },
    card2: {
      type: "int",
      references: {
        model: "cards",
        key: "id",
      },
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("player_hand");
};
