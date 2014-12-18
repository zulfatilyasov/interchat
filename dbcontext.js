var mongo = require('mongodb').MongoClient;
var guid = require('guid');
var promise = require("node-promise");
var uri = "mongodb://zulfat:518009@ds043927.mongolab.com:43927/inter-chat";
var db = null;

mongo.connect(uri, function(err, database) {
  if(err){
    console.log("error: unable to connect to db") 
  }
  console.log('connection established');
  db = database;
});

function getRoomMessages(roomId, cb) {
  db.collection(roomId).find().toArray(cb)
}

function addRoomToUser(uid, room) {
  var def = promise.defer();
  db.collection('users')
      .update({uid:uid},{$push:{rooms:room}}, function(err, result) {
        if(err != null)
          def.reject(err);
        else
          def.resolve(result);
      });
  return def.promise;
}

function insertUser(user) {
  var def = promise.defer();
  db.collection('users')
      .insert(user, function(err, result) {
        if(err != null)
          def.reject(err);
        else
          def.resolve(result);
      });
  return def.promise;
}

function insertOrUpdateUser(user, room, cb) {
  var def = promise.defer();

  var addPromiseHooks = function(promise) {
    promise.then(function(result) {
        def.resolve(result);
      },
      function(err) {
        cb(err);
        def.reject(err);
      }
    );
  };

  db.collection('users').findOne({uid:user.uid}, function(err, dbuser) {
    if(dbuser){
      addPromiseHooks(addRoomToUser(dbuser.uid, room));
    }
    else{
      user.rooms = [room];
      addPromiseHooks(insertUser(user));
    }
  });

  return def.promise;
}

function createRoom(roomTitle, users, cb) {
  var room = {
    id:guid.raw(),
    title:roomTitle
  };

  db.createCollection(room.id, { capped : true, size : 4096, max : 100 }, function(err, result) {
    if(err != null){
      cb(err);
    }
    else{
      var promises = [];
      for(i = 0; i < users.length; i++) {
        var user = users[i];
        promises.push(insertOrUpdateUser(user, room, cb));
      }
      promise.all(promises).then(function() {
        cb(null, room);
      });
    }
  });
}

function insertMessage(roomId, message, cb) {
  db.collection(roomId)
      .insert(message, cb);
}

function getUserRooms(id, cb) {
  db.collection('users').findOne({uid:parseInt(id)}, {rooms:1, _id:0}, function(err, result) {
    cb(err,result)
  });
}

exports.getRoomMessages = getRoomMessages;
exports.insertMessage = insertMessage;
exports.createRoom = createRoom;
exports.getUserRooms = getUserRooms;