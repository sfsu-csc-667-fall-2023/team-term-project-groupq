exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("game_users", {
    player_id: {
      type: "int",
      references: [ {
        model: "player_hand",
        key: "winner",
        }, {
        model: "player_hand",
        key: "loser",
        }, {
        model: "users",
        key: "id",
        },
      ],
    },
    game_id: {
      type: "int",
      references: {
        model: "games",
        key: "id",
      },
    },
    turn_order: {
      type: "int",
    },
    chip_count: {
      type: "int",
    },
    left_game: {
      type: "boolean",
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
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("game_users");
};
