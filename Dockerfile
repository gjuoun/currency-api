FROM node:12.16.1-alpine3.9
WORKDIR /usr/src/exchangeAPI
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5008
ENV PORT=5008
ENV CURRENCYLAYER_API_KEY=<API_KEY>
CMD ["npm", "start"]