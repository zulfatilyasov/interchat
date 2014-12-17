var express = require('express');
var app = express();

var mongo = require('mongodb').MongoClient;
var uri = "mongodb://zulfat:518009@ds043927.mongolab.com:43927/inter-chat";

mongo.connect(uri, function(err, db) {
  if(err){
    console.log("error: unable to connect to db") 
  }
  
  db.collection('main').findOne({}, function(err, item) {
    console.log(item);
  });
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
