// Auth0 server-side configuration

const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = require('./env');

module.exports = {

  domain: AUTH0_DOMAIN,

  audience: AUTH0_AUDIENCE,

  issuerBaseURL: `https://${AUTH0_DOMAIN}`,
};
