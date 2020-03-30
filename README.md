## Exchange API

\- powered by Express.js and Redis

---

- This server will fetch exchange rate from [CurrencyLayer](https://currencylayer.com/), then cache the rates into Redis for every 4 hours.

- You need to apply a api key on CurrencyLayer website, then replace "CURRENCYLAYER_API_KEY" with it in the .env file(see usage)

- Dockerfile is provided, let me know any issue exists.

- Server default port: 5008, Redis default port: 6379

---

### Usage:

```
Requirement: To serve in local, you need Redis installed in local/remote

1. Clone this repo
2. Copy ".env.example" as ".env", remember to set your "REDIS_HOST", "REDIS_PORT" and "CURRENCYLAYER_API_KEY"
3. Run "npm install"
4. Run "npm start"

Done!
```

---

### Test Your API:

There are only one endpoint but you can fetch in two ways,

Use your favorite rest client
```
GET http://localhost:5008/

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
GET http://localhost:5008/?from=USD&to=EUR

response: 
  {
    "success": true,
    "from": "USD",
    "to": "EUR",
    "timestamp": 1585499706,
    "rate": 0.895375
  }
```