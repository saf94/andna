const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
let connection;

function connect() {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve(connection);
      return;
    }

    MongoClient.connect(
      url,
      function(err, db) {
        if (err) {
          reject(err);
        }

        connection = db;
        resolve(db);
        return;
      }
    );
  });
}

function close() {
  if (connection) {
    connection.close();
  }
}

module.exports = {
  connect,
  close
};
