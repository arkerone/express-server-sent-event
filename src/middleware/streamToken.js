const db = require('../db');
const { ExpiredTokenError, InvalidTokenError } = require('../errors');

/**
 * Stream token Middleware
 * @module middleware/streamToken
 */

/**
 * Middleware to get a user from a stream token.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports = async (req, res, next) => {
  try {
    const { token: tokenParam } = req.params;

    const token = await db.getModel('StreamToken').findOne({
      where: { token: tokenParam },
      include: ['user']
    });

    if (!token) {
      throw new InvalidTokenError();
    }

    if (token.expiresAt < new Date()) {
      throw new ExpiredTokenError();
    }

    req.user = token.user;

    return next();
  } catch (err) {
    return next(err);
  }
};
