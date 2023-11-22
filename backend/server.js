const path = require("path");
const express = require("express");
const createError = require("http-errors");
const session = require("express-session");
//const requestTime = require("./middleware/request-time");

const { createServer } = require("http");

const { Server } = require("socket.io");

const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const {
  viewSessionData,
  sessionLocals,
  isAuthenticated,
} = require("./middleware/");

const app = express();

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
  cookie: { secure: process.env.NODE_ENV !== "development" },
});

app.use(sessionMiddleware);

if (process.env.NODE_ENV === "development") {
  app.use(viewSessionData);
}
app.use(sessionLocals);
const httpServer = createServer(app);
const io = new Server(httpServer);
io.engine.use(sessionMiddleware);

app.set("io", io);

io.on("connection", (socket) => {
  socket.join(socket.request.session.id);

  if (socket.handshake.query !== undefined) {
    socket.join(socket.handshake.query.gameSocketId);
  }
});

const Routes = require("./routes");

const ruleRoutes = require("./routes/rules");

/*
const landingRoutes = require("./routes/landing");
const authRoutes = require("./routes/authentication");
const gameRoutes = require("./routes/game");
const globalLobbyRoutes = require("./routes/global_lobby");
const endingRoutes = require("./routes/match_end");
*/

app.use("/", Routes.landing);
app.use("/auth", Routes.authentication);
app.use("/lobby", isAuthenticated, Routes.lobby, Routes.chat);
app.use("/rules", ruleRoutes);
app.use("/games", isAuthenticated, Routes.game, Routes.chat);
// app.use("/chat", isAuthenticated, Routes.chat);

/** Existing server.js content **/
app.use((request, response, next) => {
  next(createError(404));
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
