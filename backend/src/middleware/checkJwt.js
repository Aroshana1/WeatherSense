// Auth0 JWT verification middleware

const { auth } = require('express-oauth2-jwt-bearer');
const auth0Config = require('../config/auth0');

const checkJwt = auth({
  audience:      auth0Config.audience,
  issuerBaseURL: auth0Config.issuerBaseURL,
});

module.exports = checkJwt;
