var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongo = require('mongodb').MongoClient;
var uri = "mongodb://zulfat:518009@ds043927.mongolab.com:43927/inter-chat";
var db = null;

mongo.connect(uri, function(err, database) {
  if(err){
    console.log("error: unable to connect to db") 
  }
  db = database;
  // db.collection('main').findOne({}, function(err, item) {
  //   console.log(item);
  // });
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {

});

app.get('/api/messages', function(req, resp) {
  console.log(req.query);
  var room = req.query.roomId;
  db.collection(room).find().toArray(function(err, result) {
    console.log(result);
    resp.json({
      messages:result
    });
  })

});

app.post('/api/messages', function(req, resp) {
  db.collection(req.body.roomId).insert(req.body.message, function(err, result) {
    resp.send(201);
    // console.log(arguments);
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
