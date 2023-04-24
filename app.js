const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const path = require('path');
const express = require('express');
const app = express();
require('./config/express')(app);

// For starter kit env.
require('dotenv').config({
  silent: true
});

const pEnv = process.env;
pEnv.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY = "K1_z6t_8HbCINXWuDvCUykrHNIMsvQFVpmoKzpb7slKe";
pEnv.NATURAL_LANGUAGE_UNDERSTANDING_URL = "https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/c8d40d5d-1975-489a-a4ff-9f9137e6c93f";

let client;
try {
  client = new NaturalLanguageUnderstandingV1({
    version: '2021-10-15',
  });
} catch (err) {
  console.error('Error creating service client: ', err);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.post('/api/analyze', async (req, res, next) => {
  try {
    const { result } = await client.analyze(req.body);
    return res.json(result);
  } catch (error) {
    console.log(error);
    if (!client) {
      error.statusCode = 401;
      error.description =
        'Could not find valid credentials for the Natural Language Understanding service.';
      error.title = 'Invalid credentials';
    }
    next(error);
  }
});

// error-handler settings for all other routes
require('./config/error-handler')(app);

module.exports = app;
