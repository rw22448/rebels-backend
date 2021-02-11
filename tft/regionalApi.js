const express = require('express');
const axios = require('axios');
const router = express.Router({ mergeParams: true });

router.get('/get-matches/by-puuid/:puuid', async (req, res, next) => {
  if (!req.rebelsConfig.region || !req.params.puuid) {
    res.status(400).json({ message: 'Bad request' });
  }

  const localCount = req.query.count;

  await axios
    .get(
      encodeURI(
        `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${req.params.puuid}/ids`
      ),
      {
        params: {
          count: localCount,
        },
      }
    )
    .then((result) => {
      res.status(result.status).json(result.data);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
