const { Games, Users } = require("../../db");

const method = "post";
const route = "/:id/test";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId, username: user } = request.session.user;
    const { sid: userSocketId } = await Users.getUserSocket(userId);
    const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

    const io = request.app.get("io");

    // Emits a message to a specific user from userSocketId or gameSocketId (through console)
    io.to(userSocketId).emit("game:test", {
        source: "User socket",
        gameId,
        userId,
        userSocketId,
        gameSocketId,
    });
    io.to(gameSocketId).emit("game:test", {
        source: "Game socket",
        gameId,
        userId,
        userSocketId,
        gameSocketId,
    });

    response.status(200).send();
};

module.exports = { method, route, handler };