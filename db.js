var MongoClient = require('mongodb').MongoClient

var state = {
}

var connect = function (key, url) {
  console.log('url:' + url);
  if (state.hasOwnProperty(key) && state[key].db)
    return new Promise(function (resolve, reject) { resolve(); });

  return new Promise(function (resolve, reject) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
      if (err) return reject("key=" + key + ",err=" + err);
      state[key] = {};
      state[key].db = client.db(key);
      resolve();
    });
  });
}

var get = function (key) {
  if (state.hasOwnProperty(key) && state[key].db) {
    return state[key].db;
  } else {
    console.log("myget: no connection:" + key);
    return null;
  }
}

var close = function (key, done) {
  if (state.hasOwnProperty(key) && state[key].db) {
    state[key].db.close(function (err, result) {
      state[key].db = null;
      state[key].mode = null;
      done(err);
    })
  }
}

module.exports = {
  connect: connect,
  get: get,
  close: close
};
