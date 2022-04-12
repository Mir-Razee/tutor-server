const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const async = require("async");
const { file } = require("googleapis/build/src/apis/file");
const { create } = require("domain");
const { log } = require("console");

require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN);
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oAuth2Client });

function createfolder(f_name) {
  var fileMetadata = {
    name: f_name,
    mimeType: "application/vnd.google-apps.folder",
  };
  drive.files.create(
    {
      resource: fileMetadata,
      fields: "id",
    },
    function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log("Folder Id: ", file.data.id);
      }
    }
  );
}
function uploadfile() {
  var fileMetadata = {
    name: "sem42.pdf",
    parents: [folderid],
  };
  var media = {
    body: fs.createReadStream("sem42.pdf"),
  };
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log("File Id: ", file.id);
      }
    }
  );
}
function sharefolder(fid, to_email) {
  var fileId = fid;
  var permissions = [
    {
      type: "user",
      role: "reader",
      emailAddress: to_email,
    },
  ];
  // Using the NPM module 'async'
  async.eachSeries(
    permissions,
    function (permission, permissionCallback) {
      drive.permissions.create(
        {
          resource: permission,
          fileId: fileId,
          fields: "id",
        },
        function (err, res) {
          if (err) {
            // Handle error...
            console.error(err);
            permissionCallback(err);
          } else {
            console.log("Permission ID: ", res.id);
            permissionCallback();
          }
        }
      );
    },
    function (err) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        // All permissions inserted
      }
    }
  );
}

// createfolder();
// sharefolder("1UwCS96OHBxB8sOlt-ZXcDSO7h4_2GZ7L", "cse200001055@iiti.ac.in");
