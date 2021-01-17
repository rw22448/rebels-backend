const express = require('express');
const axios = require('axios');
const cors = require('cors');
const tft = require('./tft/index');

require('dotenv').config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;
const PERSONAL_API_KEY = process.env.PERSONAL_API_KEY || '';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/tft', tft);

app.use((error, req, res, next) => {
  if (error) {
    if (error.response) {
      if (error.response.status && error.response.statusText) {
        res
          .status(error.response.status)
          .json({ message: error.response.statusText });
      }
    }
  }

  res.status(500).json({ message: 'Error fetching data' });
});

axios.interceptors.request.use((req) => {
  req.headers['X-Riot-Token'] = PERSONAL_API_KEY;
  return req;
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
