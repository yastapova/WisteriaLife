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
router.get('/ad', function(req, res, next) {
    res.render('ad', {
        title: 'Ad'
    });
});

/* Defeat. */
router.get('/defeat', function(req, res, next) {
    res.render('defeat', {
        title: 'Defeat'
    });
});

/* Gameplay.- Level Number */
router.get('/gameplay/:level(\\d+)', function(req, res, next) {
    res.render('gameplay', {
        title: 'Gameplay'
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
        title: 'Level Story'
    });
});

/* Level Select. */
router.get('/level-select/:region(\\d+)', function(req, res, next) {
    res.render('level-select', {
        title: 'Level Select',
        region: req.params.region
    });
});

/* Map. */
router.get('/map', function(req, res, next) {
    res.render('map', {
        title: 'Map'
    });
});

/* Pause. */
router.get('/pause', function(req, res, next) {
    res.render('pause', {
        title: 'Pause'
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
router.get('/tutorial', function(req, res, next) {
    res.render('tutorial', {
        title: 'Tutorial'
    });
});

/* Victory. */
router.get('/victory', function(req, res, next) {
    res.render('victory', {
        title: 'Victory'
    });
});

module.exports = router;
