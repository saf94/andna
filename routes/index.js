const express = require("express");
const util = require("util");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const readline = require("readline");
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

  const TOKEN_PATH = "credentials.json";
  const SCOPES = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive"
  ];

  // Load client secrets from a local file.
  fs.readFile("client_secret.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Slides API.
    authorize(JSON.parse(content), imageUpload);
    //  authorize(JSON.parse(content), gapiSlides);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  function imageUpload(auth) {
    const drive = google.drive({ version: "v3", auth });
    var fileMetadata = {
      name: "image.png"
    };
    var media = {
      mimeType: "image/png",
      body: fs.createReadStream("public/images/image.png")
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id"
      },
      function(err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log("File Id: ", file.id);
        }
      }
    );

    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

      res.status(200).contentType("text/plain");
      // .send("File uploaded!")
      // .end("File uploaded!");
      return res.redirect("back");
    });
  }
  imageUpload();
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
      titleLocation: `${req.body.role1} , ${req.body.location1}`,
      roleSummary: req.body.roleSummary1
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

  const skills = req.body.skills.split(", ");
  const tools = req.body.tools.split(", ");

  const profile = {
    name: req.body.name,
    picture: req.body.picture,
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
  console.log("req.body", req.body);
  console.log("profile", profile);
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
