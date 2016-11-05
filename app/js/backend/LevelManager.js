/*
 * LevelManager.js
 *
 * Defines and initializes all the region level data in the game.
 * Inidividual levels are loaded on demand.
 *
 */

 var Region = require('./Region');
 var Level = require('./Level');

var LevelManager = function() {
    this.regionsMap = new Map();
    this.initRegionsMap();
    // For loading descriptions and imgs of private user custom levels later
    //this.privateCustomLevelsMap = new Map();
    //this.initPrivateCustomLevelsMap();

    // For loading descriptions and imgs of public user custom levels later. These have authors
    //this.publicCustomLevelsMap = new Map();
    //this.initPublicCustomLevelsMap();
};

LevelManager.prototype.initRegionsMap = function () {
	console.log("Init regions map called.");
	var regionsFile = "/data/regions.json";
	$.getJSON(regionsFile, function (data) {
		console.log("loading from data regions.json");
		this.loadJSONDataRegion(data);
	}.bind(this));
}

/*
 * Create a regionAttrObj from the objs in the json file
 * and map the regions accordingly.
 */
LevelManager.prototype.loadJSONDataRegion = function (data) {
	for (var i = 0; i < data.regions.length; i++) {
		var regionData = data.regions[i];
		var regionAttrObj = {
			name: regionData.name,
			img: regionData.img,
			levels: regionData.levels
		}
        this.regionsMap.set(regionData.name, new Region(regionAttrObj));
	}
}

/*
 * Create a levelAttrObj from the level obj in the json file
 * and return it
 */
LevelManager.prototype.loadJSONDataLevel = function (data) {
    var levelObj = data.level;
	var levelAttrObj = {
        grid : levelObj.grid,
        time : levelObj.time,
        enemyZone : levelObj.enemyZone,
        allowedShapes : levelObj.allowedShapes,
        messageMap : levelObj.messages,
        enemySpawns : levelObj.enemySpawns,
        defenseStructures : levelObj.defenseStructures
    };
    return levelAttrObj;
}

LevelManager.prototype.loadLevel = function(id) {
    console.log("Load level called for id: " + id);
	var levelFile = "/data/levels/" + id + ".json";
	$.getJSON(levelFile, function (data) {
		console.log("loading from data levels: " + levelFile);
        var levelAttrObj = this.loadJSONDataLevel(data);
        levelAttrObj.id = id;
		return new Level(levelAttrObj) ;
	}.bind(this));
};

/*
* Initialize the private custom levels non game data fields
*/
LevelManager.prototype.initPrivateCustomLevelsMap = function () {
	console.log("Init private custom levels map called.");
	// var regionsFile = "/data/regions.json";
	// $.getJSON(regionsFile, function (data) {
		// console.log("loading from data regions.json");
		// this.loadJSONDataRegion(data);
	// }.bind(this));
}

/*
* Initialize the public custom levels non game data fields
*/
LevelManager.prototype.initPublicCustomLevelsMap = function () {
	console.log("Init public custom levels map called.");
	// var regionsFile = "/data/regions.json";
	// $.getJSON(regionsFile, function (data) {
		// console.log("loading from data regions.json");
		// this.loadJSONDataRegion(data);
	// }.bind(this));
}

LevelManager.prototype.loadCustomLevel = function(id) {

};

var LevelManager = new LevelManager();
LevelManager.loadLevel(1);

module.exports = LevelManager;
