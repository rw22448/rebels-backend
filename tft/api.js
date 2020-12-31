const express = require('express');
const axios = require('axios');
const router = express.Router({ mergeParams: true });

router.get(
  '/get-summoner/by-name/:rebelsSummonerName',
  async (req, res, next) => {
    if (!req.rebelsConfig.region || !req.params.rebelsSummonerName) {
      res.status(400).json({ message: 'Bad request' });
    }

    await axios
      .get(
        `https://${req.rebelsConfig.region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${req.params.rebelsSummonerName}`
      )
      .then((result) => {
        res.status(result.status).json(result.data);
      })
      .catch((error) => next(error));
  }
);

router.get(
  '/get-rank-details/by-summoner-id/:encryptedSummonerId',
  async (req, res, next) => {
    if (!req.rebelsConfig.region || !req.params.encryptedSummonerId) {
      res.status(400).json({ message: 'Bad request' });
    }

    await axios
      .get(
        `https://${req.rebelsConfig.region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${req.params.encryptedSummonerId}`
      )
      .then((result) => {
        if (result.data.length > 0) {
          const rankData = result.data[0];

          res.status(result.status).json(rankData);
        } else {
          res.status(result.status).json({
            leagueId: '',
            summonerId: '',
            summonerName: '',
            queueType: '',
            tier: 'UNRANKED',
            rank: '',
            leaguePoints: 0,
            wins: 0,
            losses: 0,
            hotStreak: false,
            veteran: false,
            freshBlood: false,
            inactive: false,
          });
        }
      })
      .catch((error) => next(error));
  }
);

module.exports = router;
