var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const parseResult = dotenv.config();
const AWS = require('aws-sdk');
const fileUpload = require('express-fileupload');
const fs = require('fs');

var databaseCon = require('./databases');
const { compile } = require('ejs');

AWS.config.update({ region: 'us-west-1' });

router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: 'tmp',
  })
);

if (parseResult.error) {
  throw parseResult.error;
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log('accessKeyID: ' + process.env.AWS_ACCESS_KEY);
console.log('secretAccessKey: ' + process.env.AWS_SECRET_ACCESS_KEY);

router.get('/', function (req, res, next) {
  res.send('aws-router');
});

router.post('/upload_file', function (req, res) {
  email = req.query.email;
  fileDesciptionRec = req.query.Description;

  fullName = email.split('@')[0];
  userName = fullName.split('.')[0];
  lastName = fullName.split('.')[1];

  console.log('fileDescription received at AWS-call : ' + fileDesciptionRec);
  console.log('name & last name : ' + userName);
  console.log('name & last name : ' + lastName);

  if (!req.files) {
    return res.status(400).send('No files were selected for upload!');
  }

  // if (userName == null || userName == '' || lastName == null || lastName == '')
  //   return res
  //     .status(400)
  //     .send(
  //       'Please provide all required parameters needed for the file upload !!'
  //     );

  if (req.query.Description == null || req.query.Description == '') {
    fileDescription = req.files.inputFile.name;
  } else {
    fileDescription = fileDesciptionRec;
  }

  console.log('tempFilePath:' + req.files.inputFile.tempFilePath);
  const fileContent = fs.createReadStream(req.files.inputFile.tempFilePath);
  console.log('mimetype: ' + req.files.inputFile.mimetype);
  console.log('file desciption at AWs before DB upadte:' + fileDesciptionRec);
  var timeOfUpload = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log('>> timestamp of upload: ' + timeOfUpload);

  const uploadMetadata = {
    userFirstName: userName,
    userLastName: lastName,
    fileDescription: fileDesciptionRec,
    fileName: req.files.inputFile.name,
    dateOfUpload: timeOfUpload,
    email: email,
  };

  const uploadFileParams = {
    Bucket: 'cmpe281cloudproject1',
    Key: req.files.inputFile.name,
    ContentType: req.files.inputFile.mimetype,
    Body: fileContent,
  };

  // Using S3 upload function to upload files to the bucket
  s3.upload(uploadFileParams, function (err, data) {
    if (err) {
      console.log('Error occcured while uploading file to S3 bucket.', err);
      return res
        .status(500)
        .send(`Error occcured while uploading file to S3 bucket. ${err}`);
    } else {
      console.log(`File uploaded successfully. ${data.Location}`);
      // sendSNSMessage('file uploaded successfully at: ' + data.Location);
      var timeStamp = new Date().getTime();
      console.log(timeStamp);
      uploadMetadata.dateOfUpload = timeOfUpload;
      databaseCon.findOrInsertFileUpload(uploadMetadata);
      return res.status(200).json({
        msg: 'File uploaded successfully',
        fileMetaData: data,
        ref: data.Location,
      });
    }
  });
});

router.delete('/delete_file', function (req, res) {
  console.log('REQUEST param ', req.body);

  var userName = req.body.name;
  var lastName = req.body.lastName;

  console.log('name & last Name: ' + userName + '  ' + lastName);

  if (!req.body || !req.body.hasOwnProperty('deleteFile')) {
    return res.status(400).send('deleteFile missing in body');
  }

  const fileDeletePath = req.body.deleteFile;
  const userId = req.body.userId;

  const deleteMetadata = {
    userFirstName: userName,
    userLastName: lastName,
    fileName: fileDeletePath,
  };

  // Setting up S3 delete parameters
  const params = {
    Bucket: 'cmpe281cloudproject1',
    Key: fileDeletePath,
    /*  Delete: { 
           Objects: [ 
             {
               Key: fileDeletePath 
             }
           ],
         }, This method is useful when you want to delete multiple files */
  };
  // Deleting files to the bucket
  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log('Error in deleting file', err);
      return res.status(500).send(`Can not delete the file. ${err}`);
    } else {
      console.log(`File deleted successfully.` + JSON.stringify(data));
      databaseCon.deleteFilesDataFromDB(deleteMetadata);
      return res.status(200).json({ msg: 'File deleted successfully' });
    }
  });
});

router.get('/list_files', function (req, res) {
  var params = {
    Bucket: 'cmpe281cloudproject1' /* required */,
  };
  s3.listObjects(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      console.log("here's the list of files: " + data); // successful response
      return res.status(200).json({ msg: data });
    }
  });
});

router.get('/download_file', function (req, res) {
  var fileForDownload = req.query.fileName;

  // console.log('file name provided for download: ' + fileForDownload);
  // console.log('file name provided for download: ' + req.query.fileName);
  var params = {
    Bucket: 'cmpe281cloudproject1' /* required */,
    Key: fileForDownload,
  };
  var file = require('fs').createWriteStream(
    '/Users/prasadbidwai/Downloads/' + fileForDownload
  );

  s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      // console.log("here's the file data type: " + data.ContentType); // successful response
      // console.log("here's the file LastModified date: " + data.LastModified); // successful response
      // sendSNSMessage('file downloaded sucessfully ');
      return res.status(200).json({ msg: data });
    }
    /*
       data = {
        AcceptRanges: "bytes", 
        ContentLength: 3191, 
        ContentType: "image/jpeg", 
        ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
        LastModified: <Date Representation>, 
        Metadata: {
        }, 
        TagCount: 2, 
        VersionId: "null"
       }
       */
  })
    .createReadStream()
    .pipe(file);
});

router.get('/fetch_files_data', function (req, res) {
  // var all_files_data = databaseCon.fetchFileFromDatabase();
  // console.log(all_files_data);
  // databaseCon.getFilesData(function (err, rows) {
  //   if (err) {
  //     throw err;
  //   }
  //   // console.log('API call returned:  ' + rows);
  //   return res.status(200).json({ msg: rows });
  //   // res.send(rows);
  // });
  var userEmailToQuery = req.query.email;
  console.log(
    'API call to fetch files data with query param email: ' + userEmailToQuery
  );
  databaseCon
    .getFilesData(userEmailToQuery)
    .then(function (results) {
      console.log('data at API end-point call ' + results);
      return res.status(200).json({ data: results });
    })
    .catch(function (err) {
      console.log('Promise rejection error: ' + err);
    });
});

function sendSNSMessage(msg) {
  var params = {
    Message: msg,
    PhoneNumber: '',
  };
  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({
    apiVersion: '2010-03-31',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })
    .publish(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  publishTextPromise
    .then(function (data) {
      console.log('MessageID is ' + data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
}

module.exports = router;
