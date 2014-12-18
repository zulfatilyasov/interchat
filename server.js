var express = require('express');
var bodyParser = require('body-parser');
http = require('http');
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

app.get('/', function(req, resp) {
  resp.sendfile(__dirname + '/index.html');
});

app.get('/api/messages', function(req, resp) {
  if(!req.query || !req.query.roomId)
    resp.send('validation error', 400);

  var room = req.query.roomId;
  db.collection(room).find().toArray(function(err, result) {
    resp.json({
      messages:result
    });
  })

});

app.post('/api/messages', function(req, resp) {
  if(!req.body || !req.body.roomId || !req.body.message)
    resp.send('validation error', 400);

  db.collection(req.body.roomId)
      .insert(req.body.message, function(err, result) {
        if(result && result.length)
          io.emit('message', result[0]);
        resp.send(201);
      });
});

var server = app.listen(app.get('port'), function() {
  console.log("app is running at localhost:" + app.get('port'));
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {

});
