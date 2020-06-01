const crypto = require('crypto');
const db = require('../db');
const { token: config } = require('../config');

/**
 * SSE controller.
 * @module controllers/sse
 */

/**
 * Get Stream token for an user
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports.getToken = async (req, res, next) => {
  try {
    const { user } = req;

    const streamToken = crypto.randomBytes(64).toString('hex');

    await db.getModel('StreamToken').create({
      userId: user.id,
      token: streamToken,
      expiresAt: Date.now() + config.streamToken.expiresIn
    });

    res.json({
      streamToken,
      expiresIn: config.streamToken.expiresIn
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Connect to a SSE stream
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports.live = async (req, res) => {
  const { app, user } = req;
  const sseManager = app.get('sseManager');

  sseManager.open(user.id, res);

  sseManager.broadcast({
    id: Date.now(),
    type: 'count',
    data: sseManager.count()
  });

  req.on('close', () => {
    sseManager.delete(user.id);
    sseManager.broadcast({
      id: Date.now(),
      type: 'count',
      data: sseManager.count()
    });
  });
};
