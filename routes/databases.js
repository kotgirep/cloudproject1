var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: '3306',
  database: 'matrix',
  region: 'us-west-1b',
});

// Option 1: Passing parameters separately(p)
//const sequelize = new Sequelize('matrix', 'admin', 'password', {
//host: 'matrix.clia0jwalhon.us-west-1.rds.amazonaws.com',
//dialect: 'mysql',
//});

// Option 2: Passing a connection URI(p)
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
// function findOrInsertFileUpload(fileMetaData) {
//   console.log('trying to insert the data for file upload action');
//   console.log('user Metadata: ' + fileMetaData);
//   //   connection.connect(function (err) {
//   //     if (err) throw err;
//   //     console.log('Connected!');
//   //     var sql =
//   //       "INSERT INTO userAndFiles (userFirstName, userLastName, dateOfUpload, dateOfUpdate, fileDescription, fileName) VALUES ('Company Inc', 'Highway 37')";
//   //     con.query(sql, function (err, result) {
//   //       if (err) throw err;
//   //       console.log('1 record inserted');
//   //     });
//   //   });
// }

function findOrInsertFileUpload(fileMetaData) {
  console.log('DB operation for file upload!');
  connection.query('use matrix;');

  // var emailIDFilter = fileMetaData.email;
  // var userNameRetrieved;
  // var lastNameRetrieved;

  // var userMetaquery =
  //   'SELECT * from matrixUser where emailAddress = ' +
  //   "'" +
  //   emailIDFilter +
  //   "'";

  // console.log('userMetadata query: ' + userMetaquery);

  // connection.query(userMetaquery, function (err, result) {
  //   if (err) throw err;
  //   else {
  //     var jsonResult = JSON.stringify(result);
  //     console.log('result of metaquery: ' + jsonResult);
  //     userNameRetrieved = jsonResult.userName;
  //     lastNameRetrieved = jsonResult.lastName;
  //   }
  // });

  var sql =
    'INSERT INTO userAndFiles(userFirstName, userLastName, dateOfUpload, dateOfUpdate, fileDescription, fileName, userEmail) values(' +
    "'" +
    fileMetaData.userFirstName +
    "','" +
    fileMetaData.userLastName +
    "','" +
    fileMetaData.dateOfUpload +
    "','" +
    fileMetaData.dateOfUpload +
    "','" +
    fileMetaData.fileDescription +
    "','" +
    fileMetaData.fileName +
    "','" +
    fileMetaData.email +
    "'" +
    ')';
  console.log('printing query:' + sql);
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log('1 record inserted');
  });
}

function deleteFilesDataFromDB(fileMetaData) {
  console.log('called delete files from DB function');
  console.log('user Metadata: ' + JSON.stringify(fileMetaData));
  connection.connect(function (err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });

  connection.query('use matrix;');
  var sql =
    'Delete from userAndFiles where userFirstName = ' +
    "'" +
    fileMetaData.userFirstName +
    "'" +
    ' and userLastName = ' +
    "'" +
    fileMetaData.userLastName +
    "'" +
    ' and fileName = ' +
    "'" +
    fileMetaData.fileName +
    "'";
  console.log('printing delete query:' + sql);
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log('1 record deleted');
  });
}

function registerNewUser(newUserData) {
  // connection.end();
  console.log('database function to register a new user !!');
  console.log('new user Metadata: ' + JSON.stringify(newUserData));

  //make database connection
  connection.connect(function (err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });

  connection.query('use matrix;');
  var insertUserQuery =
    'INSERT INTO matrixUser(userName, lastName, emailAddress, hashOfSecret) values(' +
    "'" +
    newUserData.userFirstName +
    "','" +
    newUserData.userLastName +
    "','" +
    newUserData.userEmailAddress +
    "','" +
    newUserData.userPass +
    "'" +
    ')';

  console.log('printing query:' + insertUserQuery);

  connection.query(insertUserQuery, function (err, result) {
    if (err) throw err;
    console.log('1 record inserted');
  });
}

// fetching data from database
function fetchFileFromDatabase() {
  console.log('trying to fetch data from database');

  /*connection.connect(function (err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });*/

  connection.query('use matrix;');
  var sql1 = 'SELECT * from userAndFiles';

  console.log('printing query:' + sql1);
  connection.query(sql1, function (err, result) {
    if (err) throw err;
    console.log('1 record fetched successfully');
    console.log('records fetched: ' + JSON.stringify(result));
  });
  //   connection.end();
}

function fetchFileFromDatabaseTwo(callback) {
  //   connection.query('use matrix;');
  var sql1 = 'SELECT * from userAndFiles';

  console.log('printing query in fetchFileFromDatabaseTwo:' + sql1);

  connection.query(sql1, function (err, results) {
    if (err) {
      throw err;
    }
    console.log(
      'data from fetchFileFromDatabaseTwo: ' + JSON.stringify(results)
    );
    return callback(results);
  });
}

getUserAuthHash = function (emailIDFilter) {
  console.log('printing email ID passed to the DB function: ' + emailIDFilter);
  var userMetaquery =
    'SELECT * from matrixUser where emailAddress = ' +
    "'" +
    emailIDFilter +
    "'";
  console.log('printing query: ' + userMetaquery);
  return new Promise(function (resolve, reject) {
    connection.query(userMetaquery, function (err, rows) {
      if (rows === undefined) {
        reject(new Error('Error results is undefined'));
      } else {
        resolve(rows);
      }
    });
  });
};

doUserAuthentication = function (emailIDFilter, passHasFilter) {
  // console.log('printing email ID passed to the DB function: ' + emailIDFilter);
  var userMetaquery =
    'SELECT * from matrixUser where emailAddress = ' +
    "'" +
    emailIDFilter +
    "'" +
    'and hashOfSecret = ' +
    "'" +
    passHasFilter +
    "'";
  // console.log('printing query: ' + userMetaquery);
  return new Promise(function (resolve, reject) {
    connection.query(userMetaquery, function (err, rows) {
      if (rows === undefined) {
        reject(new Error('Error results is undefined'));
      } else {
        resolve(rows);
      }
    });
  });
};

function getUserAuthHashTwo(userEmailAddress, callback) {
  connection.query('use matrix;');
  console.log('querying db for useremail address: :' + userEmailAddress);
  var getUserMetadataQuery =
    'SELECT * from matrixUser where emailAddress = ' +
    "'" +
    userEmailAddress +
    "'";

  console.log('printing query in getUserAuthHashTwo:' + getUserMetadataQuery);

  connection.query(getUserMetadataQuery, function (err, results) {
    if (err) throw err;
    else callback(results);
  });
}

getFilesData = function (emailFilter) {
  var sqlQuery = '';
  console.log('db qury to fetch files data');
  if (emailFilter) sqlQuery = 'SELECT * from userAndFiles';
  else sqlQuery = 'SELECT * from userAndFiles';
  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, function (err, rows) {
      if (rows === undefined) {
        reject(new Error('Error rows is undefined'));
      } else {
        resolve(rows);
      }
    });
  });
};

// connection.end();

module.exports = router;
module.exports.findOrInsertFileUpload = findOrInsertFileUpload;
module.exports.fetchFileFromDatabase = fetchFileFromDatabase;
module.exports.fetchFileFromDatabaseTwo = fetchFileFromDatabaseTwo;
module.exports.deleteFilesDataFromDB = deleteFilesDataFromDB;
module.exports.registerNewUser = registerNewUser;
module.exports.getFilesData = getFilesData;
module.exports.getUserAuthHash = getUserAuthHash;
module.exports.getUserAuthHashTwo = getUserAuthHashTwo;
module.exports.doUserAuthentication = doUserAuthentication;
