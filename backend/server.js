const path = require("path");
const express = require("express");
const createError = require("http-errors");
const session = require("express-session");
//const requestTime = require("./middleware/request-time");

const { createServer, validateHeaderName } = require("http");

const { Server } = require("socket.io");

const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const {
  viewSessionData,
  sessionLocals,
  isAuthenticated,
} = require("./middleware/");

const app = express();
const httpServer = createServer(app);

app.use(morgan("dev"));

//app.use(requestTime);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();

  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

const sessionMiddleware = session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET, //'5HbpsviK7M4JGcNBvrZIjdAJMLFrSzaq' - makes it work for windows
  resave: false,
  saveUninitialized: false, //added for the server configuration
  cookie: { secure: process.env.NODE_ENV !== "development" },
});

app.use(sessionMiddleware);

if (process.env.NODE_ENV === "development") {
  app.use(viewSessionData);
}
app.use(sessionLocals);
const io = new Server(httpServer);
io.engine.use(sessionMiddleware);

app.set("io", io);

io.on("connection", (socket) => {
  socket.join(socket.request.session.id);

  if (socket.handshake.query.id !== undefined) {
    console.log("JOINING", socket.handshake.query.id)
    socket.join(socket.handshake.query.id);
  }
});

const Routes = require("./routes");

app.use("/", Routes.landing);
app.use("/auth", Routes.authentication);
app.use("/lobby", isAuthenticated, Routes.lobby, Routes.chat);
app.use("/rules", Routes.rules);
app.use("/games", isAuthenticated, Routes.game, Routes.chat);
app.use("/match_end", Routes.match_end);

/** Existing server.js content **/
app.use((request, response, next) => {
  next(createError(404));
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// General logic is:
/*
API endpoint (which takes some information user X in game Y -> plays this card)
create an endpoint for that validates if its validate
updates state of the game and broadcasts for everyone

when client makes a request to the server (playing a card), the client will issue a post request to the API
and ignore the response (200)
the actual update will happen asynchronously
*/
