console.log('sever start');
var app = require('express')();
var session = require('express-session');
app.use(session({
  secret: 'anal fuck',
  resave: false,
  saveUninitialized: true
}));

var socket = require('./routes/socket');
app = socket.set(app);

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/jsonAPI');

var bodyParser = require('body-parser');
var partials = require('express-partials');
var index = require('./routes/index');
var main = require('./routes/main');
var debug = require('./routes/debug');
var firebase = require('./routes/firebase');
var user = require('./routes/api/user');
var token = require('./routes/api/token');
var files = require('./routes/api/files');

var path = require ('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('express').static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use('/index', index);
app.use('/main', main);
app.use('/debug', debug);
app.use('/firebase', firebase);
app.use('/api', user);
app.use('/api', token);
app.use('/api', files);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('port', process.env.PORT || 3500);

socket.getServer().listen(app.get('port'), function () {
    console.log('Express socket server (server side) listening on port ' + app.get('port'));
});

module.exports = app;
