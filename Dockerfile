FROM node:12.16.1-alpine3.9
WORKDIR /usr/src/exchangeAPI
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5008
ENV HOST=localhost
ENV PORT=5008
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV CURRENCYLAYER_API_KEY=<API_KEY>
CMD ["npm", "start"]