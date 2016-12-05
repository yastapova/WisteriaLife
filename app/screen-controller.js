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

/* Transition. */
router.get('/transition/:level', function(req, res, next) {
    res.render('transition', {
        title: 'Transition',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level
    });
});

/* Defeat. */
router.get('/defeat/:level', function(req, res, next) {
    res.render('defeat', {
        title: 'Defeat',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level,
        region:  !isNaN(req.params.level) ? Math.floor(req.params.level/10) + 1 : 'custom'
    });
});

router.get('/editor-overlay/:level', function(req, res, next) {
    res.render('editor-overlay', {
        title: 'Editor Overlay',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level
    });
});

/* Gameplay.- Level Number */
router.get('/gameplay/:level', function(req, res, next) {
    res.render('gameplay', {
        title: 'Gameplay',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level
    });
});

/* Level Editor. */
router.get('/level-editor', function(req, res, next) {
    res.render('level-editor', {
        title: 'Level Editor'
    });
});

router.get('/level-editor/:level', function(req, res, next) {
    res.render('level-editor', {
        title: 'Level Editor',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level
    });
});

/* Level Story. */
router.get('/level-story/:level', function(req, res, next) {
    res.render('level-story', {
        title: 'Level Story',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level,
        region:  !isNaN(req.params.level) ? Math.floor(req.params.level/10) + 1 : 'custom'
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
router.get('/pause/:level', function(req, res, next) {
    res.render('pause', {
        title: 'Pause',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level,
        region:  !isNaN(req.params.level) ? Math.floor(req.params.level/10) + 1 : 'custom'
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

router.get('/save-level/:level', function(req, res, next) {
    res.render('save-level', {
        title: 'Save Level',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level
    });
});

/* Store. */
router.get('/store', function(req, res, next) {
    res.render('store', {
        title: 'Store'
    });
});

/* Tutorial. */
router.get('/tutorial/:level', function(req, res, next) {
    res.render('tutorial', {
        title: 'Tutorial',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level
    });
});

/* Victory. */
router.get('/victory/:level', function(req, res, next) {
    res.render('victory', {
        title: 'Victory',
        level: !isNaN(req.params.level) ? parseInt(req.params.level) : req.params.level,
        region: !isNaN(req.params.level) ? Math.floor(req.params.level/10) + 1 : 'custom'
    });
});

module.exports = router;
