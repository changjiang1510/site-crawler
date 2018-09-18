var express = require('express');
let bodyParser = require('body-parser');
const Crawler = require('crawler');
const db = require('../db');
const config = require('../config');
const CrawlHelper = require('../Helper/CrawlHelper');

const baseUrl = config.BASE_URL;

var router = express.Router();
router.use(bodyParser.json());

router.get('/list', async function (req, res) {
  req.setTimeout(0);
  console.log('Crawl List');
  try {
    await CrawlHelper.process();
    res.json({ result: 'OK' });
  } catch (err) {
    console.log(err);
    res.json({ error: 'Error!' });
  }
})

router.get('/details', async function (req, res) {
  req.setTimeout(0);
  const { actorId } = req.query;
  console.log('Crawl Details: ', actorId);
  try {
    await CrawlHelper.processDetails(actorId);
    res.json({ result: 'OK' });
  } catch (err) {
    console.log(err);
    res.json({ error: 'Error!' });
  }
})

module.exports = router;