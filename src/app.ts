// load .env environment variables
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express, { NextFunction } from "express";
import { convert, updateLatestRate } from "./exchange";
import { db } from "./db/db.index";

const app = express();

/* --------------------------------- Routes --------------------------------- */

app.use((req: express.Request, res: express.Response, next: NextFunction) => {
  console.log("Get request from ip - ", req.ip);
  next();
});

// query: from, to, amount
app.get("/convert", async (req, res) => {
  if (req.query.from && req.query.to) {
    // from = "CAD"
    const from = <string>req.query.from ?? "CAD";
    // query.to = "USD, CAD, CNY,..." 
    const toArr = (<string>req.query.to).split(',') ?? ["CNY"];
    const result = await convert(from, toArr);
    return res.send({ success: true, data: result });
  }
  else {
    res.status(400)
    res.send({
      success: false,
      message: "no query parameter is provided, need amount, from, to",
    });
  }

});

app.get("/all", async (req, res) => {
  res.send({
    success: true,
    data: db.get("rate").value()
  });
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
