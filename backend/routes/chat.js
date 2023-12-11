const express = require("express");
const router = express.Router();

const handler = (request, response) => {
    const{ id } = request.params;
    const { message } = request.body;
    const { username } = request.session.user;

    const io = request.app.get("io");

    io.emit(`chat:message:${id === undefined ? 0 : id}`, {
        from: username,
        timestamp: Date.now(),
        message,
    })
    response.status(200).send();
}

router.post("/chat", handler);
router.post("/:id/chat", handler);

module.exports = router;