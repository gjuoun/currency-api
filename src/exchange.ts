import axios from "axios";
import path from "path";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import currencies from "./currencies";

const adapter = new FileSync(path.join(__dirname, "../db.json"));
const db = lowdb(adapter);

/* --------------------- Global Variable Initialization --------------------- */
const API_KEY = process.env.CURRENCYLAYER_API_KEY;
// currencyList= "AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG..."
const currencyList = Object.keys(currencies).join(",");
const apiUrl = `http://api.currencylayer.com/live?access_key=${API_KEY}&currencies=${currencyList}&format=1`;
/* ------------------- End Global Variable Initialization ------------------- */

export async function fetchAndSaveToLowDb(url: string) {
  const response = await axios.get(url);

  if (response.data.success) {
    db.set("rate", response.data).write();
    db.set("lastFetchAt", Date.now()).write();
    return;
  } else {
    console.log(response.data.error.info);
  }
}

export async function updateLatestRate() {
  const rate = db.get("rate").value();
  const lastFetchAt = db.get("lastFetchAt").value();

  // set 4 hours as interval = 14,400,000 milliseconds
  const fourHours = 1000 * 60 * 60 * 4;

  if (!rate || Date.now() - lastFetchAt > fourHours) {
    console.log("Fetch new rate !");
    await fetchAndSaveToLowDb(apiUrl);
  }
  // fetch rate every 4 hours
  setInterval(async () => {
    await fetchAndSaveToLowDb(apiUrl);
    console.log("Fetched new rate at ", new Date().toString());
  }, fourHours);
}

export async function convert(amount: number = 1, from: string, to: string) {
  try {
    const rate = (await db).get("rate").value();
    const { quotes, timestamp } = rate;

    const USDFromRate = parseFloat(quotes[`USD${from.toUpperCase()}`]);
    const USDToRate = parseFloat(quotes[`USD${to.toUpperCase()}`]);
    // console.log(quotes[`USDRMB`]);

    return {
      amount,
      from,
      to,
      timestamp,
      value: (amount * USDToRate) / USDFromRate,
    };
  } catch (e) {
    console.log("Exchange:convert Error fetching rates");
    return null;
  }
}

export async function getAll() {
  try {
    return db.get("rate").value();
  } catch (e) {
    console.log("Cannot get rate from DB");
  }
}
