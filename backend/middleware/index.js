const { isAuthenticated } = require("./is-authenticated");
const { sessionLocals } = require("./session-locals");
const { viewSessionData } = require("./view-session");

module.exports = {
  isAuthenticated,
  sessionLocals,
  viewSessionData,
};
