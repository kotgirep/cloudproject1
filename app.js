var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const parseResult = dotenv.config();

console.log(parseResult.parsed);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var awsfileRouter = require('./routes/aws-files');
var dbRouter = require('./routes/databases');

var app = express();

// router.set('view-engine', 'ejs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// registration
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/awsfiles', awsfileRouter);
app.use('/dbroutes', dbRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
//

dbRouter.fetchFileFromDatabase();

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
