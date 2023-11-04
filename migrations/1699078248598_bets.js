exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("bets", {
    id: {
      type: "int",
      primaryKey: true,
      references: {
        model: "game_users",
        key: "player_id",
      },
    },
    bet_amount: {
      type: "int",
    },
    betting_when: {
      type: "rounds",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createType("rounds", ["preflop", "flop", "turn", "river"]);
};

exports.down = (pgm) => {
  pgm.dropTable("bets");
  pgm.dropType("rounds");
};
