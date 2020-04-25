// load .env environment variables
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import { convert, updateLatestRate, getAll } from "./exchange";

const app = express();


/* --------------------------------- Routes --------------------------------- */

// query: from, to, amount
app.get("/", async (req, res) => {
  console.log("Get request from ", req.ip);
  // ?? is dealing with null/undefined to set fallback value
  if (req.query.from) {
    const from = <string>req.query.from ?? "CAD";
    const to = <string>req.query.to ?? "CNY";
    const amount = parseInt(<string>req.query.amount) || 1;
    const result = await convert(amount, from, to);
    return res.send({ success: true, data: result });
  }

  res.send({
    success: false,
    message: "no query parameter is provided, need amount, from, to",
  });
});

app.get("/all", async (req, res) => {
  res.send(await getAll());
});

/* -------------------------------------------------------------------------- */
/*                  Start server and fetch rate every 4 hours                 */
/* -------------------------------------------------------------------------- */
const port = process.env.PORT || 6001;

app.listen(port, () => {
  console.log(`ExchangeAPI is running on ${port}`);
  // fetch rate every 4 hours
  updateLatestRate();
});
