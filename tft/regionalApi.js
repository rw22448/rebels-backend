const express = require('express');
const axios = require('axios');
const router = express.Router({ mergeParams: true });

router.get('/get-latest-match-details/by-puuid/:puuid', async (req, res) => {
  if (!req.rebelsConfig.region || !req.params.puuid) {
    res.status(400).json({ message: 'Bad request' });
  } else {
    const localCount = req.query.count;
    let matchIds;

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
        matchIds = result.data;
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: 'Error fetching data, could not fetch matchIds' });
      });

    if (!matchIds) {
      res
        .status(400)
        .json({ message: 'matchIds query parameter not passed or empty' });
    } else {
      try {
        const array = matchIds;

        if (array.length <= 0) {
          throw new Error();
        } else {
          try {
            let baseUrl = req.protocol + '://' + req.get('host');

            const results = await Promise.all(
              array.map(async (matchId) => {
                return await axios
                  .get(
                    `${baseUrl}/tft/${req.rebelsConfig.region}/get-match/by-match-id/${matchId}`
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
