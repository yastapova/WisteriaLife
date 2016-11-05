var Powerup = require('Powerup');

/**
 * PowerupManager.js
 * Defines and initializes all the powerups in the game
 */
var PowerupManager = function () {
	this.powerupsMap = new Map();
	this.initPowerupsMap();
};

/**
 * intializes the powerupsMap with name:String to powerup:Powerup mapping
 */
PowerupManager.prototype.initPowerupsMap = function () {
	console.log("Init powerup map called.");
	var powerupsFile = "/data/powerups.json";
	$.getJSON(powerupsFile, function (data) {
		console.log("loading from data powerups.json");
		this.loadJSONData(data);
	}.bind(this));
};

/**
 * Create a powerupAttrObj from the objs in the json file
 * and map the powerup accordingly. 
 * TO DO: add the effect functions.
 * @param data JSON data 
 */
PowerupManager.prototype.loadJSONData = function (data) {
	for (var i = 0; i < data.powerups.length; i++) {
		var powerupData = data.powerups[i];
		var powerupAttrObj = {
			name: powerupData.name,
			type: powerupData.type,
			description: powerupData.description,
			price: powerupData.price,
			thumbnail: powerupData.thumbnail
		};
		switch (powerupData.name) {
		case "Extra Time":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Stop Spawn":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Void Cell":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Tower":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Blockade":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Shield":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Caltrops":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Archer NW":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Archer NE":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Archer SE":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Archer SW":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Infantry W":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Infantry N":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Infantry E":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Infantry S":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Wall Backward":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		case "Wall Forward":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, function (level) {}));
			break;
		}
	}
};

module.exports = PowerupManager;
