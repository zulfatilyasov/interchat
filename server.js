var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var dbcontext = require('./dbcontext');
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
  dbcontext.getRoomMessages(room, function(err, result) {
    resp.json({
      messages:result
    });
  });
});

app.post('/api/messages', function(req, resp) {
  if(!req.body || !req.body.roomId || !req.body.message)
    resp.send('validation error', 400);

  dbcontext.insertMessage(req.body.roomId, req.body.message, function(err, result) {
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
