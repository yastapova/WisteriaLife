/**
 * Routing controller for different screens
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Test");
    res.render('index', {
        title: 'Express'
    });
});

router.get('/test', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;
