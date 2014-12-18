var mongo = require('mongodb').MongoClient;
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

function insertMessage(roomId, message, cb) {
  db.collection(roomId)
      .insert(message, cb);
}

exports.getRoomMessages = getRoomMessages;
exports.insertMessage = insertMessage;