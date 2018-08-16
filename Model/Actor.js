const { ObjectID } = require('mongodb');
var db = require('../db');
var config = require('../config');

var _actorDb;

var _init = function () {
  if (!_actorDb) {
    _actorDb = db.get(config.DB_NAME).collection(config.TABLE_NAME.actorTable);
  }
}

var _getAllActor = function (resolve, reject) {
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

var _insertActors = function (newData, reject) {
  if (newData && newData.length > 0) {
    _init();
    _actorDb.insertMany(newData, (err) => {
      if (err) {
        reject(err);
      }
    });
  } else {
    reject();
  }
}

var _updateActors = function (updatedData, reject) {
  _init();
  _.forEach(updatedData, ActorRecord => {
    _actorDb.update({ nNumber: ActorRecord.nNumber, ActorId: ActorRecord.ActorId }, { $set: ActorRecord }, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
}

var _findData = function (ActorId) {
  _init();
  return new Promise(function (resolve, reject) {
    _actorDb.find({ ActorId: ActorId }).toArray((err, docs) => {
      if (err || docs.length === 0) {
        reject(`Not Found : ${ActorId}`);
      } else {
        resolve(docs);
      }
    });
  });
}

var _getActorsByActorIds = function (ActorIds, resolve, reject) {
  if (!_.isArray(ActorIds)) {
    reject();
    return;
  }

  _init();
  _actorDb.find({ ActorId: { '$in': ActorIds } }).toArray((err, docs) => {
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
  updateActors: _updateActors,
  findData: _findData,
  getActorsByActorIds: _getActorsByActorIds,
}
