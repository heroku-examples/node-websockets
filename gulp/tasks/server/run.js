var app = require('express')();

var log4js = require('log4js');
log4js_extend = require("log4js-extend");
log4js.configure(require('./json/log4js/config.json'));

log4js_extend(log4js, {
    path: __dirname,
    format: "at @name (@file:@line:@column)"
});

var logger = log4js.getLogger('system');

app.use(log4js.connectLogger(logger, { level: 'auto' }));

logger.info('sever start');

var session = require('express-session');
app.use(session({
    secret: 'anal fuck',
    resave: false,
    saveUninitialized: true
}));

Object.assign = require('object-assign');

var socket = require('./routes/socket');
app = socket.set(app);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/jsonAPI');

//http://www.java2s.com/Tutorials/Javascript/Node.js_Tutorial/1290__Node.js_underscore_Package.htm

var bodyParser = require('body-parser');
var partials = require('express-partials');
var indexView = require('./routes/index');
var mainView = require('./routes/main');
var debugView = require('./routes/debug');
var firebaseView = require('./routes/firebase');
var user = require('./routes/api/user');
var token = require('./routes/api/token');
var files = require('./routes/api/files');
var say = require('./routes/api/say');
var chat = require('./routes/api/chat');
var privateChat = require('./routes/api/private_chat');
var friendRequest = require('./routes/api/friend_request');
var config = require('./routes/api/config');
var debug = require('./routes/api/debug');
var resCodes = require('./json/http/http_code_names.json');

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('express').static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use('/index', indexView);
app.use('/main', mainView);
app.use('/debug', debugView);
app.use('/firebase', firebaseView);
app.use('/api', user);
app.use('/api', token);
app.use('/api', files);
app.use('/api', say);
app.use('/api', chat);
app.use('/api', privateChat);
app.use('/api', friendRequest);
app.use('/api', config);
app.use('/api', debug);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    if (req.url == "/") {
        res.redirect("../main/redirect");
    } else {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});



// for development 
if (app.get('env') === 'development') {
    // error handlers
    // will print stacktrace
    app.use(function (err, req, res, next) {
        if (req.xhr) {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        } else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });

    var gulp = require('gulp');
    var browserSync = require('browser-sync').create();
    gulp.watch(["public/**"]).on('change', browserSync.reload);
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    if (req.xhr) {
        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
    } else {
        res.render('error', {
            message: err.message,
            error: err
        });
    }
});

var setDeviceCacheKey = function (number) {
    var ejs = require("gulp-ejs");
    var rename = require('gulp-rename');
    gulp.src("public/manifest/*.ejs")
        .pipe(ejs({
            version: number,
        }))
        .pipe(rename({ extname: '.mf' }))
        .pipe(gulp.dest("public/manifest/"));
}

var Config = require('./services/config');
Config.get('deviceCacheKey').then(function (record) {
    if(!record.number) record = {number : 0};
    if(!Number.isInteger(record.number)) record = {number : 0};
    Config.update('deviceCacheKey', {number : record.number+1}).then(function (records) {
        setDeviceCacheKey(records.number);
    }, function (error) {
        console.log("Rejected:", error);
    });
}, function (error) {
    console.log("Rejected:", error);
});


app.set('port', process.env.PORT || 3000);

socket.getServer().listen(app.get('port'), function () {
    console.log('Express socket server (server side) listening on port ' + app.get('port'));
});

module.exports = app;
