const express = require('express');
const axios = require('axios');
const { json } = require('express');
const router = express.Router({ mergeParams: true });

router.get('/get-matches/by-puuid/:puuid', async (req, res) => {
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
      console.log(error);

      res.status(500).json({ message: 'Error fetching data' });
    });
});

router.get('/get-match-details', async (req, res) => {
  if (!req.rebelsConfig.region) {
    res.status(400).json({ message: 'Bad request' });
  }

  if (!req.query.matchIds) {
    res.status(400).json({ message: 'matchIds query parameter not passed' });
  }

  try {
    const array = JSON.parse(req.query.matchIds);

    if (array.length <= 0) {
      res.status(400).json({ message: 'matchIds array is empty' });
    }

    const results = await Promise.all(
      array.map(async (matchId) => {
        return await axios
          .get(
            `https://${req.rebelsConfig.region}.api.riotgames.com/tft/match/v1/matches/${matchId}`
          )
          .then((result) => {
            return result.data;
          })
          .catch((error) => {
            console.log(error);

            throw error;
          });
      })
    );

    const orderedResults = results.sort();

    const latestMatchDateTime = orderedResults[0].info.game_datetime;

    res.status(200).json({
      latestMatchDateTime: latestMatchDateTime,
      matchIds: array,
      results: orderedResults,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

module.exports = router;
