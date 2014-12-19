var express = require('express');
var bodyParser = require('body-parser');
var md5 = require('MD5');
var app = express();
var dbcontext = require('./dbcontext');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

var appSecret = '4B8QDwGqJLVtgWEDymVg';
var appId = '4683043';

function isAuthenticated(req, resp, next) {
  var authKey = req.get('Auth-Key');
  var viewerId = req.get('Viewer-Id');
  var correctAuthKey = md5(appId+'_'+viewerId+'_'+appSecret);
  if(correctAuthKey === authKey)
    next();
}
app.use(isAuthenticated);
app.get('/', function(req, resp) {
  resp.sendfile(__dirname + '/index.html');
});

app.get('/api/messages', function(req, resp) {
  if(!req.query || !req.query.roomId){
    resp.send('validation error', 400);
    return;
  }

  var room = req.query.roomId;
  dbcontext.getRoomMessages(room, function(err, result) {
    resp.json({
      messages:result
    });
  });
});

app.post('/api/messages', function(req, resp) {
  if(!req.body || !req.body.roomId || !req.body.message){
    resp.send('validation error', 400);
    return;
  }

  dbcontext.insertMessage(req.body.roomId, req.body.message, function(err, result) {
    if(result && result.length)
      io.sockets.in(req.body.roomId).emit('message', result[0]);
    resp.send(201);
  });
});

app.post('/api/rooms', function(req, resp) {
  console.log(req.body);
  if(!req.body || !req.body.roomTitle || !req.body.users) {
    resp.send('validation error', 400);
    return;
  }

  dbcontext.createRoom(req.body.roomTitle, req.body.users, function(err, result) {
    if(err!=null){
      resp.send(400);
      console.log(err);
    }
    else{
      resp.json(result);
    }
  });
});

app.get('/api/rooms',function(req, resp) {
  if(!req.query || !req.query.uid){
    resp.sendStatus(400);
    return;
  }
  dbcontext.getUserRooms(req.query.uid, function(err, rooms) {
    if(err!=null) {
      resp.sendStatus(400);
      return;
    }
    resp.json(rooms);
  });
});

var server = app.listen(app.get('port'), function() {
  console.log("app is running at localhost:" + app.get('port'));
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  socket.room = 'main';
  socket.join('main');

  socket.on('changeRoom', function(newroom){
    socket.leave(socket.room);
    socket.join(newroom);
    socket.room = newroom;
  });
});
