const express = require("express");
const util = require("util");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const { quickstart, googleSlideUrl } = require("../quickstart");

const router = express.Router();
const url = "mongodb://localhost:27017/appdb";
const upload = multer({ limits: { fileSize: 2000000 }, dest: "public/images" });

module.exports = router;

// Default route http://localhost:3000/
router.get("/", function(req, res) {
  res.render("index");
});
// Form POST action handler
router.post("/uploadpicture", upload.single("picture"), function(req, res) {
  // console.log("req.body", req.body);
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "../public/images/image.png");

  console.log("tempPath", tempPath);
  console.log("targetPath", targetPath);
  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res);

    res.status(200).contentType("text/plain");
    // .send("File uploaded!")
    // .end("File uploaded!");
    return res.redirect("back");
  });
});

router.get("/picture/:picture", function(req, res) {
  // assign the URL parameter to a variable
  const filename = req.params.picture;
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
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) console.log(err);

      db.collection("profiles").find({}, () => {});
    }
  );
  res.sendFile(path.join(__dirname, "../public/squads.html"));
});

router.post("/formSubmit", function(req, res) {
  let experience = [
    {
      titleLocation: `${req.body.role} , ${req.body.location}`,
      roleSummary: req.body.roleSummary
    }
  ];

  if (req.body.role2) {
    experience.push({
      titleLocation: `${req.body.role2} , ${req.body.location2}`,
      roleSummary: req.body.roleSummary2
    });
  }

  if (req.body.role3) {
    experience.push({
      titleLocation: `${req.body.role3} , ${req.body.location3}`,
      roleSummary: req.body.roleSummary3
    });
  }
  console.log("req.body", req.body);
  console.log("experience", experience);

  const skills = req.body.skills.split(", ");
  const tools = req.body.tools.split(", ");

  const profile = {
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
  quickstart(req.params.name);
  // res.sendFile(path.join(__dirname, "../public/export.html"));
  res.end();
});

router.get("/profile", function(req, res) {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) console.log(err);

      db.collection("profiles")
        .find({})
        .toArray((err, docs) => {
          console.log(docs);
          res.json(docs);
        });
    }
  );
});

router.get("/imageUpload", function(req, res) {});
