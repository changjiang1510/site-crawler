var request = require('request');
var cheerio = require('cheerio');
var Crawler = require("crawler");
var URL = require('url-parse');
var db = require('./db');
var config = require('./config');
var Actor = require('./Model/Actor');

var startUrl = config.START_URL;
var dbUrl = config.MONGO_ADDRESS;
var baseUrl = config.BASE_URL;
var initFullUrl = baseUrl + startUrl;

var numPagesVisited = 1;
var pageList = [];

const mainProcess = async function () {
  try {
    await db.connect(config.DB_NAME, dbUrl);
    pageList[initFullUrl] = initFullUrl;
    console.log("DB connected!");
    await Actor.resetTable();
    crawlListPage();
  } catch (err) {
    console.log(err);
    // console.log('Unable to connect to Mongo. ' + ":" + err);
    process.exit(1);
  }
}
mainProcess();

function crawlListPage() {
  try {
    var c = new Crawler({
      maxConnections: 10,
      // This will be called for each crawled page
      callback: function (error, res, done) {
        if (error) {
          console.log(error);
          throw (error);
        } else {
          var $ = res.$;
          console.log('----------------------');
          console.log(res.request.uri.href, "visited");
          crawlListPageContent($);
          const pagesToVisit = collectInternalLinks($);
          if (pagesToVisit.length > 0) {
            // visitPage(c, pagesToVisit);
          }
        }
        done();
      }
    });
    c.queue(initFullUrl);
    c.on('drain', function () {
      console.log(numPagesVisited, " pages visited.");
      crawlDetailsPage();
    });
  } catch (error) {
    throw (error);
  }
}

async function crawlDetailsPage() {
  try {
    var c = new Crawler({
      maxConnections: 10,
      // This will be called for each crawled page
      callback: function (error, res, done) {
        if (error) {
          console.log(error);
          throw (error);
        } else {
          var $ = res.$;
          console.log('----------------------');
          console.log(res.request.uri.href, "visited");
        }
        done();
      }
    });
    const actorData = await Actor.getAllActor();
    actorData.map(actor => {
      numPagesVisited += 1;
      c.queue([{
        uri: `${baseUrl}/${actor.detailUrl}`,
        callback: function (error, res, done) {
          if (error) {
            console.log(error);
            throw (error);
          } else {
            var $ = res.$;
            console.log('----------------------');
            console.log(res.request.uri.href, "visited");
            crawlDetailsPageContent($, actor);
          }
          done();
        }
      }]);
      return;
    })
    c.on('drain', function () {
      console.log(numPagesVisited, " pages visited.");
    });
  } catch (error) {
    throw (error);
  }
}


function visitPage(crawler, urlArray) {
  // Add page to our set
  numPagesVisited += urlArray.length;
  crawler.queue(urlArray);
}

function collectInternalLinks($) {
  var relativeLinks = $("div.pagination").find("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  let pagesToVisit = [];
  relativeLinks.each(function () {
    const pageUrl = baseUrl + $(this).attr('href');
    if (!(pageUrl in pageList)) {
      pagesToVisit.push(pageUrl);
      pageList[pageUrl] = pageUrl;
    }
  });
  return pagesToVisit;
}

async function crawlListPageContent($) {
  var contentList = $("h2.ttl");
  console.log("Found " + contentList.length + " content cells on page");
  const newActors = [];
  contentList.each(function () {
    const tagArea = $(this).siblings('.tagarea').find("a");
    const tags = [];
    if ((tagArea.length > 0)) {
      tagArea.each(function () {
        tags.push($(this).text());
      });
    }
    newActors.push(
      {
        name: $(this).text(),
        detailUrl: $(this).children().attr('href'),
        kanaName: $(this).siblings('.furi').get(0).children[0].data,
        thumbnail: $(this).parent().siblings().find("img").attr('src'),
        tags,
      }
    );
  });
  try {
    await Actor.insertActors(newActors);
  } catch (error) {
    throw(error);
  }
}

async function crawlDetailsPageContent($, actor) {
  var rateTable = $("table.rate-table");
  const detailsInfo = {};
  if (rateTable.length>0) {
    const tableRow = rateTable.find("tr");
    detailsInfo.rate = [];
    tableRow.each(function () {
      const rateCell = $(this).children('td.t9');
      if(rateCell.length > 0) {
        detailsInfo.rate.push(
          {
            field: rateCell.get(0).children[0].data,
            score: rateCell.get(1).children[0].data,
          }
        );
      }
    });
  }
  const updatedInfo = Object.assign(detailsInfo, actor);
  // Update each successful record
  try {
    await Actor.updateSingleActor(updatedInfo);
  } catch (error) {
    throw (error);
  }
}