const express = require('express');
const { auth, streamToken } = require('../middleware');
const { sse: controller } = require('../controllers');

const router = express.Router();

router.post('/stream/token', auth, controller.getToken);
router.get('/stream/live/:token', streamToken, controller.live);

/**
 * SSE routes.
 * @module routes/sse
 */
module.exports = router;
