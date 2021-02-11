const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const api = require('./api');
const regionalApi = require('./regionalApi');

const oneSecondLimiter = rateLimit({
  windowMs: 1 * 1000,
  max: 20,
});

const twoMinuteLimiter = rateLimit({
  windowMs: 2 * 1000 * 60,
  max: 100,
});

router.use(
  '/br1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'br1',
    };

    next();
  },
  api
);

router.use(
  '/eun1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'eun1',
    };

    next();
  },
  api
);

router.use(
  '/euw1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'euw1',
    };

    next();
  },
  api
);

router.use(
  '/jp1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'jp1',
    };

    next();
  },
  api
);

router.use(
  '/kr',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'kr',
    };

    next();
  },
  api
);

router.use(
  '/la1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'la1',
    };

    next();
  },
  api
);

router.use(
  '/la2',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'la2',
    };

    next();
  },
  api
);

router.use(
  '/na1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'na1',
    };

    next();
  },
  api
);

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

router.use(
  '/tr1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'tr1',
    };

    next();
  },
  api
);

router.use(
  '/ru',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'ru',
    };

    next();
  },
  api
);

router.use(
  '/americas',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'americas',
    };

    next();
  },
  regionalApi
);

router.use(
  '/asia',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'asia',
    };

    next();
  },
  regionalApi
);

router.use(
  '/europe',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'europe',
    };

    next();
  },
  regionalApi
);

module.exports = router;
