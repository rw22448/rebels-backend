const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const api = require('./api');

const oneSecondLimiter = rateLimit({
  windowMs: 1 * 1000,
  max: 20,
});

const twoMinuteLimiter = rateLimit({
  windowMs: 2 * 1000 * 60,
  max: 100,
});

router.use(
  '/oc1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'oc1',
    };

    next();
  },
  api
);

module.exports = router;
