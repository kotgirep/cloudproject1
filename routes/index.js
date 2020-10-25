var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function (req, res, next) {
  // console.log('session: ' + req.session.t1);
  res.render('index1', { title: 'Express' });
});

module.exports = router;
