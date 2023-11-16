const isAuthenticated = (request, response, next) => {
  if (request.session.user !== undefined) {
    // if the session exists (not undefined) then proceed to the next page. If the session is undefined
    next(); // undefined = not authenticated, then lobby and games cannot be accessed.
  } else {
    response.redirect("/");
  }
};

module.exports = { isAuthenticated };
