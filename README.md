## Exchange API

> Convert currencies and cache exchange rate from [CurrencyLayer](https://currencylayer.com/) for every 4 hours

[Github repo](https://github.com/gjuoun/exchange-api)

[API documentation](https://stoplight.io/p/docs/gh/gjuoun/exchange-api)

## Install

    > git clone https://github.com/gjuoun/exchange-api.git

## Usage

    > npm run build

    > npm start

## Docker Usage

    > docker image build -t exchange-api:1.0 .

    > docker run -d \
      -e PORT=6001 \
      -e CURRENCYLAYER_API_KEY=<Currency_Layer_API_key> \
      -p 6001:6001 \
      exchange-api:1.0


## Roadmap

- [x] Cache Exchange Rate every 4 hours
- [x] Dockerfile
- [ ] Have SQL database options (postgres)
- [ ] Websocket support
