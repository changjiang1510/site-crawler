var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var db = require('./db');
var Actor = require('./Model/Actor');

var START_URL = "http://www.minnano-av.com/actress_list.php";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10;
var dbUrl = "mongodb://localhost:27017/siteCrawler";

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var pageList = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

console.log(baseUrl);

db.connect('siteCrawler', dbUrl).then(() => {
  pagesToVisit.push(START_URL);
  pageList[START_URL] = START_URL;
  console.log("connect");
  crawl();
}).catch((err) => {
  console.log('Unable to connect to Mongo. ' + ":" + err);
  process.exit(1);
});

function crawl() {
  // if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
  //   console.log("Reached max limit of number of pages to visit.");
  //   return;
  // }
  var nextPage = pagesToVisit.pop();
  if (!nextPage) {
    console.log(numPagesVisited, " pages visited.");
    return;
  }
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);
    var contentList = $("h2.ttl");
    console.log('----------------------');
    console.log("Found " + contentList.length + " content cells on page");
    const newActors = [];
    contentList.each(function () {
      newActors.push(
        {
          name: $(this).text(),
          detailUrl: $(this).children().attr('href'),
          kanaName: $(this).siblings('.furi')[0].children[0].data,
        }
      );
    });
    Actor.insertActors(newActors, (err) => {
      if (err) {
        console.log('----------------------');
        console.log(err);
      }
    });
    // getLastPageLink($);
    collectInternalLinks($);
    callback();
  });
}

function getLastPageLink($) {
    var relativeLinks = $("a[href^='/'][title='Last']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
      lastPageUrl = $(this).attr('href');
        // pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}

function collectInternalLinks($) {
  var relativeLinks = $("div.pagination").find("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  relativeLinks.each(function () {
    const pageUrl = baseUrl + $(this).attr('href');
    if (!(pageUrl in pagesVisited) && !(pageUrl in pageList)) {
      pagesToVisit.push(pageUrl);
      pageList[pageUrl] = pageUrl;
    }
  });
}