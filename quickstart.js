const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const db = require("./db");
const opn = require("opn");
let googleSlideUrl;

function quickstart(nameToExport) {
  console.log("#1: start of quickstart function");
  // BEGINNING OF AUTH SECTION
  /**
   * If modifying scopes, delete credentials.json.
   * Script will recreate it with new permissions.
   */
  const TOKEN_PATH = "credentials.json";
  const SCOPES = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive"
  ];

  // Load client secrets from a local file.
  fs.readFile("client_secret.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Slides API.
    authorize(JSON.parse(content), gapiDrive);
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

  // END OF AUTH SECTION

  // BEGINNING OF SCRIPTS SECTION

  let presentationCopyId;
  const fileId = "17kQGK9rBRDTYrzk2s4L-nA1qXUt4htg-UGgNoSBiAj0";

  function gapiDrive(auth) {
    console.log("#2: start of gapidrive function");
    const drive = google.drive({ version: "v3", auth });
    drive.files.copy(
      {
        fileId: fileId
      },
      (err, driveResponse) => {
        if (err) return console.log("The API returned an error: " + err);
        console.log(
          `Copied presentation with ID ${fileId} to presentation with ID ${
            driveResponse.data.id
          }`
        );
        presentationCopyId = driveResponse.data.id;

        fs.readFile("client_secret.json", (err, content) => {
          if (err) return console.log("Error loading client secret file:", err);
          // Authorize a client with credentials, then call the Google Slides API.
          authorize(JSON.parse(content), gapiSlides);
        });

        function gapiSlides(auth) {
          console.log("#3: start of gapiSlides function");
          const slides = google.slides({ version: "v1", auth });

          // Define what to subsitute
          getProfiles(nameToExport).then(profiles => {
            console.log("#4: .then after getProfiles function");
            console.log("profiles in get profiles", profiles);
            googleSlideUrl =
              "https://docs.google.com/presentation/d/" + presentationCopyId;

            const googleSlideRequest = generateGoogleSlideRequest(profiles[0]);
            // Execute the requests for this presentation.
            slides.presentations.batchUpdate(
              {
                presentationId: presentationCopyId,
                resource: {
                  requests: googleSlideRequest
                }
              },
              (err, batchUpdateResponse) => {
                if (err)
                  return console.log("The API returned an error: " + err);
                const result = batchUpdateResponse;
              }
            );
          });
        }
      }
    );
    console.log("#5: end of gapidrive");
  }

  function getProfiles(exportedName) {
    console.log("#6: Beginning of getProfiles function");
    console.log("exportedName", exportedName);
    return new Promise((resolve, reject) => {
      db.connect().then(conn => {
        const appdb = conn.db("appdb");
        const collection = appdb.collection("profiles");

        const profiles = collection
          .find({ name: exportedName })
          .toArray((err, profiles) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(profiles);
            console.log("profiles", profiles);
            return;
          });
      });
    });
  }

  console.log("nameToExport", nameToExport);
  // getProfiles(nameToExport);
  console.log("#7: end of quickstart function");
}

function generateGoogleSlideRequest(profile) {
  console.log("#8: beginnging of googleslidesrequest function");
  const googleSlideRequest = [];
  console.log("profile", profile.experience);
  profile.experience.forEach((experience, index) => {
    googleSlideRequest.push({
      replaceAllText: {
        containsText: { text: "{titleLocation" + index + "}", matchCase: true },
        replaceText: experience.titleLocation
      }
    });
    googleSlideRequest.push({
      replaceAllText: {
        containsText: { text: "{summary" + index + "}", matchCase: true },
        replaceText: experience.roleSummary
      }
    });
  });

  for (let i = 0; i < 8; i++) {
    if (profile.skills[i]) {
      googleSlideRequest.push({
        replaceAllText: {
          containsText: { text: "{skills" + i + "}", matchCase: true },
          replaceText: profile.skills[i]
        }
      });
    } else {
      googleSlideRequest.push({
        replaceAllText: {
          containsText: { text: "{skills" + i + "}", matchCase: true },
          replaceText: ""
        }
      });
    }
  }

  for (let i = 0; i < 8; i++) {
    if (profile.tools[i]) {
      googleSlideRequest.push({
        replaceAllText: {
          containsText: { text: "{tools" + i + "}", matchCase: true },
          replaceText: profile.tools[i]
        }
      });
    } else {
      googleSlideRequest.push({
        replaceAllText: {
          containsText: { text: "{tools" + i + "}", matchCase: true },
          replaceText: ""
        }
      });
    }
  }

  googleSlideRequest.push({
    replaceAllText: {
      containsText: {
        text: "{name}",
        matchCase: true
      },
      replaceText: profile.name
    }
  });

  googleSlideRequest.push({
    replaceAllText: {
      containsText: {
        text: "{role}",
        matchCase: true
      },
      replaceText: profile.role
    }
  });

  googleSlideRequest.push({
    replaceAllText: {
      containsText: {
        text: "{linkedin}",
        matchCase: true
      },
      replaceText: profile.linkedin
    }
  });

  googleSlideRequest.push({
    replaceAllText: {
      containsText: {
        text: "{summary}",
        matchCase: true
      },
      replaceText: profile.summary
    }
  });
  console.log("#9: end of googleslidesrequest function");
  opn(googleSlideUrl);
  return googleSlideRequest;
}

module.exports = { quickstart, generateGoogleSlideRequest };
