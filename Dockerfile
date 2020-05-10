FROM node:12.16.1-alpine3.9
WORKDIR /usr/home/gjuoun/exchange-api
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 6001
ENV PORT=6001
ENV CURRENCYLAYER_API_KEY=<API_KEY>
CMD ["npm", "start"]