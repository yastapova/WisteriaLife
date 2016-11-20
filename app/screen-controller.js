/**
 * Routing controller for different screens
 */

var express = require('express');
var router = express.Router();

/* Home page - Splash Screen. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Welcome'
    });
});

/* About Screen. */
router.get('/about', function(req, res, next) {
    res.render('about', {
        title: 'About'
    });
});

/* Ad. */
router.get('/ad/:level(\\d+)', function(req, res, next) {
    res.render('ad', {
        title: 'Ad',
        level: Number.parseInt(req.params.level)
    });
});

/* Defeat. */
router.get('/defeat/:level(\\d+)', function(req, res, next) {
    res.render('defeat', {
        title: 'Defeat',
        level: Number.parseInt(req.params.level)
    });
});

/* Gameplay.- Level Number */
router.get('/gameplay/:level(\\d+)', function(req, res, next) {
    res.render('gameplay', {
        title: 'Gameplay',
        level: Number.parseInt(req.params.level)
    });
});

/* Level Editor. */
router.get('/level-editor', function(req, res, next) {
    res.render('level-editor', {
        title: 'Level Editor'
    });
});

/* Level Story. */
router.get('/level-story/:level(\\d+)', function(req, res, next) {
    res.render('level-story', {
        title: 'Level Story',
        level: Number.parseInt(req.params.level),
        region: Math.floor(Number.parseInt(req.params.level)/10) + 1
    });
});

/* Level Select. */
router.get('/level-select/:region(\\d+)', function(req, res, next) {
    res.render('level-select', {
        title: 'Level Select',
        region: Number.parseInt(req.params.region)
    });
});

/* Map. */
router.get('/map', function(req, res, next) {
    res.render('map', {
        title: 'Map'
    });
});

/* Pause. */
router.get('/pause/:level(\\d+)', function(req, res, next) {
    res.render('pause', {
        title: 'Pause',
        level: Number.parseInt(req.params.level),
        region: Math.floor(Number.parseInt(req.params.level)/10) + 1
    });
});

/* Public Custom Levels. */
router.get('/public-custom-levels', function(req, res, next) {
    res.render('public-custom-levels', {
        title: 'Public Custom Levels'
    });
});

/* Private Custom Levels. */
router.get('/private-custom-levels', function(req, res, next) {
    res.render('private-custom-levels', {
        title: 'Private Custom Levels'
    });
});

/* Save Level. */
router.get('/save-level', function(req, res, next) {
    res.render('save-level', {
        title: 'Save Level'
    });
});

/* Store. */
router.get('/store', function(req, res, next) {
    res.render('store', {
        title: 'Store'
    });
});

/* Tutorial. */
router.get('/tutorial/:level(\\d+)', function(req, res, next) {
    res.render('tutorial', {
        title: 'Tutorial',
        level: Number.parseInt(req.params.level)
    });
});

/* Victory. */
router.get('/victory/:level(\\d+)', function(req, res, next) {
    res.render('victory', {
        title: 'Victory',
        level: Number.parseInt(req.params.level),
        region: Math.floor(Number.parseInt(req.params.level)/10) + 1
    });
});

module.exports = router;
