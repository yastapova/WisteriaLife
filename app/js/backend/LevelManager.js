var Region = require('Region');
var Level = require('Level');
var firebase = require("firebase");

/**
 * LevelManager.js
 *
 * Defines and initializes all the region level data in the game.
 * Inidividual levels are loaded on demand.
 */
var LevelManager = function() {
    this.regionsMap = new Map();
    // For loading descriptions and imgs of private user custom levels later
    //this.privateCustomLevelsMap = new Map();
    //this.initPrivateCustomLevelsMap();

    // For loading descriptions and imgs of public user custom levels later. These have authors
    //this.publicCustomLevelsMap = new Map();
    //this.initPublicCustomLevelsMap();
};

/**
 * Load resource
 * @param  {Function} callback
 *         Success callback function (called when done loading and processing)
 */
LevelManager.prototype.load = function (callback) {
    this.loadRegions(callback);
};

// Loads the regions from firebase
LevelManager.prototype.loadRegions = function(callback) {
    // Reference to the /regions/ database path
    firebase.database().ref('regions').once('value', function (snapshot) {
        this.loadJSONDataRegion(snapshot.val(), callback);
    }.bind(this));
};

/**
 * Create a regionAttrObj from the objs in the json file
 * and map the regions accordingly.
 * @param  data JSON data
 */
LevelManager.prototype.loadJSONDataRegion = function (data, callback) {
	for (var i = 0; i < data.length; i++) {
		var regionData = data[i];
		var regionAttrObj = {
			name: regionData.name,
			img: regionData.img,
			levels: regionData.levels
		};
        this.regionsMap.set(regionData.name, new Region(regionAttrObj));
	}

    callback();
};

/**
 * Create a levelAttrObj from the level obj in the json file
 * and return it
 * @param  data JSON data
 * @return the leveLAttrObj that will be used for initializing a Level
 */
LevelManager.prototype.loadJSONDataLevel = function (data) {
	var levelAttrObj = {
        grid : data.grid,
        time : data.time,
        enemyZone : data.enemyZone,
        allowedShapes : data.allowedShapes,
        messages : data.messages,
        enemySpawns : data.enemySpawns,
        defenseStructures : data.defenseStructures
    };
    return levelAttrObj;
};

/**
 * Load a level with given id
 * @param {integer} id          integer denoting the id of the level
 * @param {function} setLevel   callback function to set level
 * @return the level object with the given id
 */
LevelManager.prototype.loadLevel = function (id, setLevel) {
    console.log("Load level called for id: " + id);
    // Reference to the /levels/ database path
    firebase.database().ref('levels').once('value', function (snapshot) {
        var levelAttrObj = this.loadJSONDataLevel(snapshot.val()[id]);
        levelAttrObj.id = id;
        setLevel(new Level(levelAttrObj));
    }.bind(this));
};


/**
 * Initialize the private custom levels non game data fields
 * @return {[type]} [description]
 */
LevelManager.prototype.initPrivateCustomLevelsMap = function () {
	console.log("Init private custom levels map called.");
	// var regionsFile = "/data/regions.json";
	// $.getJSON(regionsFile, function (data) {
		// console.log("loading from data regions.json");
		// this.loadJSONDataRegion(data);
	// }.bind(this));
};

/**
 * Initialize the public custom levels non game data fields
 * @return {[type]} [description]
 */
LevelManager.prototype.initPublicCustomLevelsMap = function () {
	console.log("Init public custom levels map called.");
	// var regionsFile = "/data/regions.json";
	// $.getJSON(regionsFile, function (data) {
		// console.log("loading from data regions.json");
		// this.loadJSONDataRegion(data);
	// }.bind(this));
};

/**
 * Load a custom level with given id
 * @param  id integer denoting the id of the level
 * @return the level object with the given id
 */
LevelManager.prototype.loadCustomLevel = function(id) {

};

module.exports = LevelManager;
