/*
const http = require('http');
const express = require('express');
const app = express();
var path = require('path');

app.use(express.static('public'));

var router = express.Router();

router.get('/', function(req, res) {
  res.send('index.html')
})

router.get('/bio', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/bio.html'));
})

app.use('/', router);

app.set("view engine", "html");

app.listen(3000, () => console.log('Example app listening on port 3000!'));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("appdb");
  dbo.createCollection("profiles", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });

  dbo.collection("profiles").insertOne({ username: "shayat@and.digital", name: "Saf Hayat"}, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();    
  });
}); 

*/
