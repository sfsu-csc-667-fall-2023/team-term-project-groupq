const viewSessionData = (request, _response, next) => {
  console.log(request.session);
  next();
};

module.exports = { viewSessionData };
