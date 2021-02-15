const express = require('express');
const axios = require('axios');
const { json } = require('express');
const router = express.Router({ mergeParams: true });

router.get('/get-matches/by-puuid/:puuid', async (req, res) => {
  if (!req.rebelsConfig.region || !req.params.puuid) {
    res.status(400).json({ message: 'Bad request' });
  } else {
    const localCount = req.query.count;

    await axios
      .get(
        encodeURI(
          `https://${req.rebelsConfig.region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${req.params.puuid}/ids`
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
        console.log(error);

        res.status(500).json({ message: 'Error fetching data' });
      });
  }
});

router.get('/get-match/by-match-id/:matchId', async (req, res) => {
  if (!req.rebelsConfig.region || !req.params.matchId) {
    res.status(400).json({ message: 'Bad request' });
  } else {
    await axios
      .get(
        `https://${req.rebelsConfig.region}.api.riotgames.com/tft/match/v1/matches/${req.params.matchId}`
      )
      .then((result) => {
        res.status(result.status).json(result.data);
      })
      .catch((error) => {
        console.log(error);

        res.status(500).json({ message: 'Error fetching data' });
      });
  }
});

module.exports = router;
