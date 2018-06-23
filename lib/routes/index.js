"use strict";

var express = require("express");
var util = require("util");
var fs = require("fs-extra");
var multer = require("multer");
var path = require("path");

var _require = require("mongodb"),
  MongoClient = _require.MongoClient,
  ObjectId = _require.ObjectId;

var _require2 = require("../../quickstart"),
  quickstart = _require2.quickstart;

var router = express.Router();
var url = "mongodb://localhost:27017/appdb";
var upload = multer({ limits: { fileSize: 2000000 }, dest: "uploads/" });

module.exports = router;

// Default route http://localhost:3000/
router.get("/", function(req, res) {
  res.render("index");
});
// Form POST action handler
router.post("/uploadpicture", upload.single("picture"), function(req, res) {
  if (req.file == null) {
    // If Submit was accidentally clicked with no file selected...
    res.render("index", { title: "Please select a picture file to submit!" });
  } else {
    MongoClient.connect(
      url,
      function(err, db) {
        // read the img file from tmp in-memory location
        var newImg = fs.readFileSync(req.file.path);
        // encode the file as a base64 string.
        var encImg = newImg.toString("base64");
        // define your new document
        var newItem = {
          description: req.body.description,
          contentType: req.file.mimetype,
          size: req.file.size,
          img: Buffer(encImg, "base64")
        };
        db.collection("profiles").insert(newItem, function(err, result) {
          if (err) {
            console.log(err);
          }
          var newoid = new ObjectId(result.ops[0]._id);
          fs.remove(req.file.path, function(err) {
            if (err) {
              console.log(err);
            }
            res.render("index", { title: "Thanks for the Picture!" });
          });
        });
      }
    );
  }
});

router.get("/picture/:picture", function(req, res) {
  // assign the URL parameter to a variable
  var filename = req.params.picture;
  // open the mongodb connection with the connection
  // string stored in the variable called url.
  MongoClient.connect(
    url,
    function(err, db) {
      db.collection("profiles")
        // perform a mongodb search and return only one result.
        // convert the variabvle called filename into a valid
        // objectId.
        .findOne({ _id: ObjectId(filename) }, function(err, results) {
          // set the http response header so the browser knows this
          // is an 'image/jpeg' or 'image/png'
          res.setHeader("content-type", results.contentType);
          // send only the base64 string stored in the img object
          // buffer element
          res.send(results.img.buffer);
        });
    }
  );
});

router.get("/bio", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/bio.html"));
});
router.get("/squads", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/squads.html"));
});

router.post("/formSubmit", function(req, res) {
  var experience = [
    {
      titleLocation: req.body.role1 + " , " + req.body.location1,
      roleSummary: req.body.roleSummary1
    }
  ];

  if (req.body.role2) {
    experience.push({
      titleLocation: req.body.role2 + " , " + req.body.location2,
      roleSummary: req.body.roleSummary2
    });
  }

  if (req.body.role3) {
    experience.push({
      titleLocation: req.body.role3 + " , " + req.body.location3,
      roleSummary: req.body.roleSummary3
    });
  }

  var skills = req.body.skills.split(", ");
  var tools = req.body.tools.split(", ");

  var profile = {
    name: req.body.name,
    role: req.body.title,
    linkedin: req.body.LinkedIn,
    summary: req.body.Summary,
    experience: experience,
    skills: skills,
    tools: tools
  };

  MongoClient.connect(
    url,
    function(err, db) {
      if (err) console.log(err);

      db.collection("profiles").insert(profile, function() {
        // res.json({ message: "ok" });
      });
    }
  );

  console.log("profile", profile);
  // quickstart();
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/export/:name", function(req, res) {
  res.send(req.params);
});
