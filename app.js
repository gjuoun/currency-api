// load .env environment variables
require("dotenv").config();

const express = require("express");
const axios = require("axios");
const redis = require("redis");
const moment = require("moment");

/*
---Initialization of the app
*/
const app = express();
const client = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379
});

const currencies = require("./currencies");
// currencyList= "AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG..."
const currencyList = Object.keys(currencies).join(",");

const API_KEY = process.env.CURRENCYLAYER_API_KEY;

const URL = `http://api.currencylayer.com/live?access_key=${API_KEY}&currencies=${currencyList}&format=1`;

client.on("connect", () => {
  console.log("Redis Client connected");
});

client.on("error", () => {
  console.log("Redis Client can't connect.");
});

/*
---Initialization of the app --- end
*/

/* response example
 data: {
    success: true,
    terms: 'https://currencylayer.com/terms',
    privacy: 'https://currencylayer.com/privacy',
    timestamp: 1585499706,
    source: 'USD',
    quotes: {
      USDUSD: 1,
      USDAUD: 1.622041,
      USDCAD: 1.40235,
      USDPLN: 4.07375,
      USDMXN: 23.391039
    }
  }
*/

const fetchAndSaveToRedis = () => {
  axios.get(URL).then(res => {
    if (res.data.success) {
      // set rate and fetchTime
      client.set("rate", JSON.stringify(res.data));

      client.set("lastFetchTime", Date.now());
      console.log(
        "Fetch rate and Set Redis value at: ",
        new Date().toISOString()
      );
    } else {
      console.log("Fetch rate error");
    }
  });
};

// param: from, to
app.get("/", (req, res) => {
  // if have query parameter, convert rate
  if (req.query.from) {
    const { from, to } = req.query;
    client.get("rate", (err, rateStr) => {
      const { quotes, timestamp } = JSON.parse(rateStr);
      const USDFromRate = parseFloat(quotes[`USD${from.toUpperCase()}`]);
      const USDToRate = parseFloat(quotes[`USD${to.toUpperCase()}`]);

      res.status(200);
      res.send({
        success: true,
        from,
        to,
        timestamp,
        rate: USDToRate / USDFromRate
      });
    });
  }
  // if no query parameter is provided, send all rates
  else {
    res.status(200);
    client.get("rate", (err, rateStr) => {
      res.send(JSON.parse(rateStr));
    });
  }
});

/*
 start server
*/
const port = process.env.PORT || 5008;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(
    `ExchangeAPI is running on ${host}:${port}, connecting to Redis server...`
  );

  // set 4 hours as interval = 14,400,000 milliseconds
  const fourHours = 1000 * 60 * 60 * 4;

  // if lastFetchTime within 4 hours, then don't fetch
  client.get("lastFetchTime", (err, lastFetchTime) => {
    let lastFetchTimeInt = parseInt(lastFetchTime);

    // lastFetchTime > 4 hours, fetch rate
    if (lastFetchTime && Date.now() - lastFetchTimeInt > fourHours) {
      fetchAndSaveToRedis();
    } else if (!lastFetchTime) {
      // initialize lastFetchTime in redis
      client.set("lastFetchTime", Date.now());
      fetchAndSaveToRedis();
      console.log("Initialize Redis...");
    }
    // lastFetchTIme < 4 hours
    else {
      console.log(
        "Last fetch time was:[",
        new Date(lastFetchTimeInt).toISOString(),
        "],it's",
        moment.unix(lastFetchTimeInt / 1000).fromNow(),
        ".Don't need to fetch now."
      );
      // incase of no "rate" value in Redis
      client.get("rate", (err, rateStr) => {
        if (!rateStr) {
          fetchAndSaveToRedis();
        }
      });
    }
  });

  // fetch every 4 hours
  setInterval(() => {
    fetchAndSaveToRedis();
  }, fourHours);
});
