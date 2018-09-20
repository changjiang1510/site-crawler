var express = require('express');
let bodyParser = require('body-parser');

const config = require('../config');
const Actor = require('../Model/Actor');

const baseUrl = config.BASE_URL;

var router = express.Router();
router.use(bodyParser.json());

router.get('/details/:actorId', async function (req, res) {
  console.log("Get Details");
  const { actorId } = req.params;
  try {
    const result = await Actor.getActorByActorId(actorId);
    const actor = Object.assign(result, {
      thumbnail: `${baseUrl}/${result.thumbnail}`,
      detailUrl: `${baseUrl}/${result.detailUrl}`,
    });
    res.json({ data: actor });
  } catch (err) {
    console.log(err);
    res.json({ error: 'No data!' });
  }
})

router.get('/list', async function (req, res) {
  try {
    const filter = req.query;
    console.log(filter);
    const result = await Actor.getActorList(filter);
    const actorList = result.map(actor =>
      Object.assign(actor, {
        thumbnail: `${baseUrl}/${actor.thumbnail}`,
        detailUrl: `${baseUrl}/${actor.detailUrl}`,
      }));
    res.json({ data: actorList });
  } catch (err) {
    console.log(err);
    res.json({ error: 'No data!' });
  }
})

module.exports = router;