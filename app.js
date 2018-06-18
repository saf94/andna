const http = require('http');

const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("appdb");
  dbo.createCollection("profiles", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}); 
