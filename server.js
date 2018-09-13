const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const config = require('./config');
const server = express();
const port = 3333;

const dbUrl = config.MONGO_ADDRESS;

const ActorApi = require('./API/ActorApi');
const CrawlApi = require('./API/CrawlApi');

server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use('/api/actor', ActorApi);
server.use('/api/crawl', CrawlApi);

db.connect(
  config.DB_NAME,
  dbUrl
).then(() => {
  http.createServer(server).listen(port, () => {
    console.log('api server started on port ' + port)
  });
})
  .catch((err) => {
    console.log('Unable to connect to DB. ' + ":" + err);
    process.exit(1);
  })
