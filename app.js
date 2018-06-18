/*
const http = require('http');

const express = require('express');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => res.render('index.html'));

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

  // dbo.collection("profiles").insertOne({ username: "shayat@and.digital", name: "Saf Hayat"}, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document inserted");
  //   db.close();    
  // });
}); 

*/
