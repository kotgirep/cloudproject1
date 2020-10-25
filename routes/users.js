var express = require('express');
var router = express.Router();
var databaseCon = require('./databases');
var crypto = require('crypto');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//create login

router.get('/login', (req, res) => {
  res.render('login1.ejs');
});
router.post('/login', (req, res) => {});

router.get('/register', (req, res) => {
  res.render('register.ejs');
});

router.post('/register_user', function (req, res) {
  userName = req.query.name;
  lastName = req.query.lastName;
  emailAddress = req.query.email;
  userPass = req.query.userPass;

  if (
    req.query.name == null ||
    req.query.name == '' ||
    req.query.lastName == null ||
    req.query.lastName == '' ||
    req.query.email == null ||
    req.query.email == '' ||
    req.query.userPass == null ||
    req.query.userPass == ''
  )
    return res
      .status(400)
      .send(
        'Please provide all required parameters needed for user registeration !!'
      );

  var userPassHash = crypto.createHash('md5').update(userPass).digest('hex');
  console.log('user password hash is:' + userPassHash);

  const uploadMetadata = {
    userFirstName: userName,
    userLastName: lastName,
    userEmailAddress: emailAddress,
    userPass: userPassHash,
  };
  databaseCon.registerNewUser(uploadMetadata);
});

router.get('/userMetadata', function (req, res) {
  emailAddress = req.query.email;
  console.log('API call to retrieve userMetadata');
  if (req.query.email == null || req.query.email == '')
    return res
      .status(400)
      .send(
        'Please provide all required parameters needed for getting userMetadata !!'
      );
  databaseCon
    .getUserAuthHash(emailAddress)
    .then(function (results) {
      console.log('data at API end-point call ' + results);
      return res.status(200).json({ data: results });
    })
    .catch(function (err) {
      console.log('Promise rejection error: ' + err);
    });
});

router.get('/login_user', function (req, res) {
  emailAddress = req.query.email;
  userPass = req.query.pass;
  console.log('API call to login an existing user');
  if (
    req.query.email == null ||
    req.query.email == '' ||
    req.query.pass == null ||
    req.query.pass == ''
  )
    return res
      .status(400)
      .send(
        'Please provide all required parameters needed for getting userMetadata !!'
      );
  var userPassHash = crypto.createHash('md5').update(userPass).digest('hex');
  // console.log('user password hash is:' + userPassHash);

  databaseCon
    .doUserAuthentication(emailAddress, userPassHash)
    .then(function (results) {
      // console.log('data at API end-point call ' + results);
      // console.log('data at API length ' + results.length);
      if (results.length > 0) {
        // console.log('user is authenticated, now redirecting !!');
        // return res.status(200).json({ data: results });
        return res.status(200).json({ Msg: 'success' });
      } else return res.status(403).json({ msg: 'user authentication is failed !!' });
    })
    .catch(function (err) {
      console.log('Promise rejection error: ' + err);
    });
});

router.get('/userMetadataTwo', function (req, res) {
  emailAddress = req.query.email;
  console.log(
    'API end point: userMetadataTwo and email passed ' + emailAddress
  );
  return databaseCon.getUserAuthHashTwo(emailAddress);
});

router.post('/register', (req, res) => {});

module.exports = router;
