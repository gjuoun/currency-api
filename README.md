## Exchange API

\- powered by Express.js and lowdb(json local db)

---

- This server will fetch exchange rate from [CurrencyLayer](https://currencylayer.com/), then cache the rates into Redis for every 4 hours.

- You need to apply a api key on CurrencyLayer website, then replace "CURRENCYLAYER_API_KEY" with it in the .env file(see usage)


---

### Usage:

```
Requirement: To serve in local, you need Redis installed in local/remote

1. Clone this repo
2. Copy ".env.example" as ".env", remember to set your "PORT", and "CURRENCYLAYER_API_KEY"
3. Run "npm install"
4. Run "npm run buildRun"

Done!
```

---

### Test Your API:

There are only one endpoint but you can fetch in two ways,

Use your favorite rest client
```
GET http://localhost:6001/all

response: 
  {
    "success": true,
    "terms": "https://currencylayer.com/terms",
    "privacy": "https://currencylayer.com/privacy",
    "timestamp": 1585499706,
    "source": "USD",
    "quotes": {
        "USDAED": 3.673042,
        "USDAFN": 76.850404,
        "USDALL": 115.603989,
        "USDAMD": 498.430403,
        ...
    }
  }
```
> Tips: Currency Code can be found in https://www.xe.com/en/iso4217.php
```
GET http://localhost:6001/?from=USD&to=EUR&amount=1000

response: 
{
    "success": true,
    "data": {
        "amount": 1000,
        "from": "USD",
        "to": "EUR",
        "timestamp": 1587832507,
        "value": 924.0390000000001
    }
}
```
