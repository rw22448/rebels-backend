const express = require('express');
const axios = require('axios');
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

router.get('/get-match-details', async (req, res) => {
  if (!req.query.regionalRoute) {
    res
      .status(400)
      .json({ message: 'regionalRoute query parameter not passed' });
  } else {
    if (!req.query.matchIds) {
      res
        .status(400)
        .json({ message: 'matchIds query parameter not passed or empty' });
    } else {
      try {
        const array = req.query.matchIds;

        if (array.length <= 0) {
          throw new Error();
        } else {
          try {
            let baseUrl = req.protocol + '://' + req.get('host');

            const results = await Promise.all(
              array.map(async (matchId) => {
                return await axios
                  .get(
                    `${baseUrl}/tft/${req.query.regionalRoute}/get-match/by-match-id/${matchId}`,
                    {}
                  )
                  .then((result) => {
                    return result.data;
                  })
                  .catch(() => {
                    return;
                  });
              })
            );

            var trueLength = 0;

            for (var i = 0; i < results.length; i++) {
              if (results[i] !== undefined) {
                trueLength++;
              }
            }

            let orderedResults = [];
            let latestMatchDateTime = null;

            if (trueLength > 0) {
              orderedResults = results.sort();

              if (orderedResults[0].hasOwnProperty('info')) {
                latestMatchDateTime = orderedResults[0].info.game_datetime;
              }
            }

            res.status(200).json({
              latestMatchDateTime: latestMatchDateTime,
              matchIds: array,
              results: orderedResults,
            });
          } catch (error) {
            res.status(500).json({ message: 'Error fetching data' });
          }
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
      }
    }
  }
});

module.exports = router;
