const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const SALT_ROUNDS = 10;

const { Users } = require("../db/index"); // if you leave off the file name, it will automatically import for index file

router.get("/sign_up", (_request, response) => {
  response.render("sign_up");
});

router.post("/sign_up", async (request, response) => {
  const { username, password } = request.body;
  console.log("SIGN UP", { username, password });

  const username_exists = await Users.username_exists(username);
  console.log({ username_exists });
  if (username_exists) {
    response.redirect("/");
    return;
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  const user = await Users.create(username, password);
  console.log({ user_after_create: user })
  request.session.user = user;

  response.redirect("/lobby");
});

router.post("/sign_in", async (request, response) => {
  const { username, password } = request.body;
  console.log("SIGN IN", { username, password });
  try {
    const user = await Users.find_username(username);

    const isValidUser = password == user.password;
    //const isValidUser = await bcrypt.compare(password, user.password);

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    if (isValidUser) {
      request.session.user = {
        id: user.id,
        username,
      };

      response.redirect("/lobby");
      return;
    } else {
      response.render("landing", {
        error: "The credentials provided are incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    response.render("landing", {
      error: "The credentials provided are incorrect",
    });
  }
});

router.get("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});

module.exports = router;
