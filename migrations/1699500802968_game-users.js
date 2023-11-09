exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
  pgm.createTable("game_users", {
    id: {
      type: "int",
      primaryKey: true,
    },
    user_id: {
      type: "int",
      references: [ {
        model: "rounds",
        key: "winner",
        }, {
        model: "rounds",
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
