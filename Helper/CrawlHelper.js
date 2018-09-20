
const Crawler = require('crawler');
const db = require('../db');
const config = require('../config');
const Actor = require('../Model/Actor');

const startUrl = config.START_URL;
const dbUrl = config.MONGO_ADDRESS;
const baseUrl = config.BASE_URL;
const initFullUrl = baseUrl + startUrl;

const Helper = {
  numPagesVisited: 1,
  pageList: [],
  process() {
    var self = this;
    return new Promise(function (resolve, reject) {
      const mainProcess = async () => {
        try {
          self.numPagesVisited = 1;
          self.pageList = [];
          self.pageList[initFullUrl] = initFullUrl;
          await Actor.resetTable();
          self.crawlListPage(resolve);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }
      mainProcess();
    })
  },
  processDetails(actorId) {
    var self = this;
    return new Promise(function (resolve, reject) {
      const mainProcess = async () => {
        try {
          self.numPagesVisited = 0;
          self.pageList = [];
          const result = await Actor.getActorByActorId(actorId);
          const actorList = [result];
          self.crawlDetails(actorList, resolve);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }
      mainProcess();
    })
  },
  crawlListPage(resolve) {
    try {
      const c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: (error, res, done) => {
          if (error) {
            console.log(error);
            throw error;
          } else {
            const { $ } = res;
            console.log('----------------------');
            console.log(res.request.uri.href, 'visited');
            this.crawlListPageContent($);
            const pagesToVisit = this.collectInternalLinks($);
            if (pagesToVisit.length > 0) {
              // visitPage(c, pagesToVisit);
            }
          }
          done();
        },
      });
      c.queue(initFullUrl);
      c.on('drain', async () => {
        console.log(this.numPagesVisited, ' pages visited.');
        const actorList = await Actor.getActorList();
        this.crawlDetails(actorList, resolve);
      });
    } catch (error) {
      throw error;
    }
  },
  async crawlDetails(actorList, resolve) {
    try {
      const c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: (error, res, done) => {
          if (error) {
            console.log(error);
            throw error;
          } else {
            // const { $ } = res;
            console.log('----------------------');
            console.log(res.request.uri.href, 'visited');
          }
          done();
        },
      });
      var self = this;
      actorList.map(actor => {
        self.numPagesVisited += 1;
        c.queue([
          {
            uri: `${baseUrl}/${actor.detailUrl}`,
            callback: (error, res, done) => {
              if (error) {
                console.log(error);
                throw error;
              } else {
                const { $ } = res;
                console.log('----------------------');
                console.log(res.request.uri.href, 'visited');
                this.crawlDetailsPageContent($, actor);
              }
              done();
            },
          },
        ]);
        return;
      });
      c.on('drain', () => {
        console.log(this.numPagesVisited, ' pages visited.');
        resolve();
      });
    } catch (error) {
      throw error;
    }
  },
  visitPage(crawler, urlArray) {
    // Add page to our set
    this.numPagesVisited += urlArray.length;
    crawler.queue(urlArray);
  },

  collectInternalLinks($) {
    var self = this;
    const relativeLinks = $('div.pagination').find("a[href^='/']");
    console.log('Found ', relativeLinks.length, ' relative links on page');
    const pagesToVisit = [];
    relativeLinks.each(function () {
      const pageUrl = baseUrl + $(this).attr('href');
      if (!(pageUrl in self.pageList)) {
        pagesToVisit.push(pageUrl);
        self.pageList[pageUrl] = pageUrl;
      }
    });
    return pagesToVisit;
  },
  async crawlListPageContent($) {
    const contentList = $('h2.ttl');
    console.log('Found ', contentList.length, ' content cells on page');
    const newActors = [];
    contentList.each(function () {
      const tagArea = $(this)
        .siblings('.tagarea')
        .find('a');
      const tags = [];
      if (tagArea.length > 0) {
        tagArea.each(function () {
          tags.push($(this).text());
        });
      }
      newActors.push({
        name: $(this).text(),
        detailUrl: $(this)
          .children()
          .attr('href'),
        kanaName: $(this)
          .siblings('.furi')
          .get(0).children[0].data,
        thumbnail: $(this)
          .parent()
          .siblings()
          .find('img')
          .attr('src'),
        tags,
      });
    });
    try {
      await Actor.insertActors(newActors);
    } catch (error) {
      throw error;
    }
  },
  async crawlDetailsPageContent($, actor) {
    const rateTable = $('table.rate-table');
    const detailsInfo = {};
    if (rateTable.length > 0) {
      const tableRow = rateTable.find('tr');
      detailsInfo.rate = [];
      tableRow.each(function () {
        const rateCell = $(this).children('td.t9');
        if (rateCell.length > 0) {
          detailsInfo.rate.push({
            field:
              rateCell.get(0).children[0].data ||
              rateCell.get(0).children[0].children[0].data,
            score: parseFloat(rateCell.get(1).children[0].data),
          });
        }
      });
    }
    const actProfile = $('div.act-profile');
    if (actProfile.length > 0) {
      const tagArea = actProfile.find('.tagarea');
      if (tagArea.length > 0) {
        const tags = [];
        if (tagArea.length > 0) {
          tagArea.find('a').each(function () {
            tags.push($(this).text());
          });
        }
        detailsInfo.tags = tags;
      }
      const infoFields = actProfile.find('td');
      infoFields.each(function () {
        const fieldName = $(this).get(0).children[0];
        if (fieldName.name === 'span' && fieldName.children[0].data === 'サイズ') {
          if ($(this).get(0).children[1] && $(this).get(0).children[1].children[1]) {
            detailsInfo.size = $(this).get(0).children[1].children[1].children[0].data;
          }
        }
      });
    }
    const updatedInfo = Object.assign(actor, detailsInfo);
    // Update each successful record
    try {
      await Actor.updateSingleActor(updatedInfo);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Helper;