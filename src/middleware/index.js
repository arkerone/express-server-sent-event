const auth = require('./auth');
const errorHandler = require('./errorHandler');
const streamToken = require('./streamToken');

/**
 * Middleware
 * @module middleware
 */
module.exports = {
  auth,
  errorHandler,
  streamToken
};
