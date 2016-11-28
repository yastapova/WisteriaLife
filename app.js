/**
 * Primary backend script
 *
 * Wisteria Life
 */

/**
 * Wisteria Life Backend
 *
 * A few minimal changes will be needed to have this actually work.
 *
 */
// var GameData = require('./app/js/backend/GameData');
// var GameLogicManager = require('./app/js/backend/GameLogicManager');
// var GameManager = require('./app/js/backend/GameManager');
// var Level = require('./app/js/backend/Level');
// var LevelManager = require('./app/js/backend/LevelManager');
// var Powerup = require('./app/js/backend/Powerup');
// var PowerupManager = require('./app/js/backend/PowerupManager');
// var ScreenManager = require('./app/js/backend/ScreenManager');
// var Shape = require('./app/js/backend/Shape');
// var ShapeManager = require('./app/js/backend/ShapeManager');
// var User = require('./app/js/backend/User');

/**
 * Express.js
 */
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/screens'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'app/public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/public')));

/**
 * Wisteria Life
 * App/Screens Routing
 */
var screens = require('./app/screen-controller');
app.use('/', screens);

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
        res.render('404', {
            message: err.message,
            error: err,
            title: 'Page Not Found'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('404', {
        message: err.message,
        error: {},
        title: 'Page Not Found'
    });
});

module.exports = app;
