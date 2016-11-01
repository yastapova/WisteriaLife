/**
 * Primary backend script
 *
 * Wisteria Life
 */
var express = require('express');

var app = express();

// include backend components
var GameData = require('./app/js/backend/GameData');
var GameLogicManager = require('./app/js/backend/GameLogicManager');
var GameManager = require('./app/js/backend/GameManager');
var Level = require('./app/js/backend/Level');
var LevelManager = require('./app/js/backend/LevelManager');
var Powerup = require('./app/js/backend/Powerup');
var PowerupManager = require('./app/js/backend/PowerupManager');
var ScreenManager = require('./app/js/backend/ScreenManager');
var Shape = require('./app/js/backend/Shape');
var ShapeManager = require('./app/js/backend/ShapeManager');
var User = require('./app/js/backend/User');

module.exports = app;
