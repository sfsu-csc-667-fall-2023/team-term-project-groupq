const path = require("path");
const express = require("express");
const createError = require("http-errors");
const requestTime = require("./middleware/request-time");
const rootRoutes = require("./routes/root");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const testRoutes = require("./routes/test/index.js");

app.use("/test", testRoutes);

app.use(morgan("dev"));

app.use(requestTime);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

app.use("/", rootRoutes);

/** Existing server.js content **/
app.use((request, response, next) => {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
