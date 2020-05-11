import axios from "axios";
import ms from 'ms'
import currencies from "./currencies";
import { db } from './db/db.index'
import { Rate } from './types/types.index'

/* --------------------- Global Variable Initialization --------------------- */
const API_KEY = process.env.CURRENCYLAYER_API_KEY;
// currencyList= "AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG..."
const currencyList = Object.keys(currencies).join(",");
const apiUrl = `http://api.currencylayer.com/live?access_key=${API_KEY}&currencies=${currencyList}&format=1`;
/* ------------------- End Global Variable Initialization ------------------- */

export async function fetchRate(url: string) {
  const response = await axios.get(url);

  if (response.data.success) {
    let { data } = response
    let rate: Rate = {
      timestamp: data.timestamp,
      source: "USD",
      quotes: data.quotes
    }
    db.set("rate", rate).write();
    db.set("lastFetchAt", Math.round(Date.now() / 1000)).write();
    return;
  } else {
    console.log(response.data.error.info);
  }
}

export async function updateLatestRate() {
  const rate = db.get("rate").value();
  const lastFetchAt = db.get("lastFetchAt").value();

  // set 4 hours as interval = 14,400,000 milliseconds
  // const fourHours = 1000 * 60 * 60 * 4;
  const fourHours = ms("4h");

  if (!rate ||
    Math.round(Date.now() / 1000) - lastFetchAt > fourHours) {
    console.log("Fetch new rate !");
    await fetchRate(apiUrl);
  }
  // fetch rate every 4 hours
  setInterval(async () => {
    await fetchRate(apiUrl);
    console.log("Fetched new rate at ", new Date().toString());
  }, fourHours);
}

export async function convert(from: string, toArr: string[]) {
  try {
    const rate = db.get("rate").value();
    const { quotes, timestamp } = rate;

    let convertedQuotes: any = {}
    for (let to of toArr) {
      const USDFromRate = parseFloat(quotes[`USD${from.toUpperCase()}`]);
      const USDToRate = parseFloat(quotes[`USD${to.toUpperCase()}`]);
      convertedQuotes[`${from + to}`] = USDToRate / USDFromRate
    }

    return {
      timestamp,
      source: from,
      // to: toArr,
      quotes: convertedQuotes
    };
  } catch (e) {
    console.log("Exchange:convert Error fetching rates");
  }
}

