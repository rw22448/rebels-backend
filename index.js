const express = require('express');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const tftRoute = require('./tft/index');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const PERSONAL_API_KEY = process.env.PERSONAL_API_KEY;

const oneSecondLimiter = rateLimit({
  windowMs: 1 * 1000,
  max: 20,
});

const twoMinuteLimiter = rateLimit({
  windowMs: 2 * 1000 * 60,
  max: 100,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(
  '/tft/oc1',
  twoMinuteLimiter,
  oneSecondLimiter,
  (req, res, next) => {
    req.rebelsConfig = {
      region: 'oc1',
    };

    next();
  },
  tftRoute
);

app.use((error, req, res, next) => {
  res.status(error.response.status).json({ message: error.message });
});

axios.interceptors.request.use((req) => {
  req.headers['X-Riot-Token'] = PERSONAL_API_KEY || '';
  return req;
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
