const { ObjectID } = require('mongodb');
var db = require('../db');
var config = require('../config');

var _actorDb;

var _init = function () {
  if (!_actorDb) {
    _actorDb = db.get(config.DB_NAME).collection(config.TABLE_NAME.actorTable);
  }
}

var _getAllActor = function () {
  return new Promise(function (resolve, reject) {
    _init();
    _actorDb.find({}).toArray((err, newDocs) => {
      if (err) {
        console.log('error', err);
        reject(err);
      } else {
        // console.log(newDocs);
        resolve(newDocs);
      }
    });
  });
}

var _deleteById = function (targetId, resolve, reject) {
  _init();
  _actorDb.deleteOne({ _id: new ObjectID(targetId) }, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
}

var _insertActors = function (newData) {
  return new Promise(function (resolve, reject) {
    if (newData && newData.length > 0) {
      _init();
      _actorDb.insertMany(newData, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    } else {
      reject();
    }
  });
}

var _updateMultipleActors = function (updatedData) {
  return new Promise(function (resolve, reject) {
    _init();
    _.forEach(updatedData, actorRecord => {
      _actorDb.update({ _id: actorRecord._id }, { $set: actorRecord }, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });
}

var _updateSingleActor = function (actorRecord) {
  return new Promise(function (resolve, reject) {
    _init();
    _actorDb.updateOne({ _id: ObjectID(actorRecord._id) }, { $set: actorRecord }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

var _getActorsByActorId = function (actorId) {
  _init();
  return new Promise(function (resolve, reject) {
    _actorDb.findOne({ _id: new ObjectID(actorId) }, (err, docs) => {
      if (err || !docs) {
        reject(`Not Found : ${actorId}`);
      } else {
        resolve(docs);
      }
    });
  });
}

var _getActorsByActorIds = function (actorIds, resolve, reject) {
  if (!_.isArray(actorIds)) {
    reject();
    return;
  }

  _init();
  _actorDb.find({ actorId: { '$in': actorIds } }).toArray((err, docs) => {
    if (err && _.isFunction(reject)) {
      reject(err);
    } else if (_.isFunction(resolve)) {
      resolve(docs);
    }
  });
}

var _createTable = function (resolve, reject) {
  db.get(config.DB_NAME).createCollection(config.TABLE_NAME.actorTable, (err, result) => {
    if (err) {
      console.log('Create Table Unsuccessfully!', err);
      reject(err);
    } else {
      console.log('Table Created!');
      resolve();
    }
  })
}

var _dropTable = function (resolve, reject) {
  _init();
  _actorDb.estimatedDocumentCount((err, count) => {
    if (count !== 0) {
      _actorDb.drop((err) => {
        if (err) {
          console.log('Drop Table Unsuccessfully!', err);
          reject(err);
        } else {
          console.log('Table Dropped!');
          resolve();
        }
      });
    } else {
      resolve();
    }
  })
}

var _resetTable = async function () {
  return new Promise((resolve, reject) => {
    _dropTable(() => {
      _createTable(resolve, reject);
    }, reject);
  });
}

module.exports = {
  createTable: _createTable,
  dropTable: _dropTable,
  resetTable: _resetTable,
  getAllActor: _getAllActor,
  deleteById: _deleteById,
  insertActors: _insertActors,
  updateMultipleActors: _updateMultipleActors,
  updateSingleActor: _updateSingleActor,
  getActorsByActorId: _getActorsByActorId,
  getActorsByActorIds: _getActorsByActorIds,
}
