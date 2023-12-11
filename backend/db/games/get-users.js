const database = require("../connection");
const { connection: db } = database;

const GET_USERS = `
  SELECT game_users.user_id, game_users.web_position, 
  game_users.current_player, users.username, 
  (
    SELECT sid FROM session
    WHERE (sess->'user'->>'id')::int=user_id
    ORDER BY expire DESC
    LIMIT 1
  ) as sid
  FROM game_users, users
  WHERE game_id=$1 AND (game_users.user_id=users.id) ORDER BY game_users.user_id;
`;

const GET_USER_SID = `
  SELECT user_id, (
    SELECT sid FROM session
    WHERE (sess->'user'->>'id')::int=user_id
    ORDER BY expire DESC
    LIMIT 1
  ) as sid
  FROM game_users
  WHERE game_id=$1 AND user_id=$2
`

const GET_ACTIVE_PLAYERS = `
  SELECT (sess->'user'->>'username') as username FROM session;
`

const GET_GAME_PLAYER_COUNT =
`
SELECT games.id, games.players_allowed,game_count.user_count 
FROM games, (SELECT game_id, count(user_id) AS user_count FROM game_users GROUP BY game_id ORDER BY game_id) AS game_count 
WHERE games.id=game_count.game_id ORDER BY games.id;
`

const USER_ALREADY_IN_GAME = `SELECT count(user_id) FROM game_users WHERE game_id=$1 AND user_id=$2`

const getUsers = (gameId) => db.many(GET_USERS, [gameId]);
const getUserSID = (gameId, userId) => db.one(GET_USER_SID, [gameId, userId]);
const getActivePlayers = () => db.any(GET_ACTIVE_PLAYERS);
const isAlreadyInGame = (gameId, userId) => db.any(USER_ALREADY_IN_GAME, [gameId, userId]);

const getPlayerGameCount = () => db.any(GET_GAME_PLAYER_COUNT);

module.exports = { getUsers, getUserSID, getActivePlayers, isAlreadyInGame, getPlayerGameCount };


