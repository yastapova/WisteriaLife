/* 
 * PowerupManager.js
 * Defines an initializes all the powerups in the game
 */

 /*
  * listOfPowerups is an array of strings (maybe use a json file for this?)
  * powerupsMap is a Map<string, powerup>
  */
var PowerupManager = function(listOfPowerups) {
	this.powerupsList = listOfPowerups;
    this.powerupsMap = new Map();
	for (var i = 0; i < powerupsList.length; i++) {
		initPowerup(powerupsList[i]);
		console.log("initialized " + powerupsList[i])
	}
};

/*
 * Initialize the power up and add it to the map of powerups
 * TO DO: implement the effect function for the specified powerups
 */
PowerupManager.prototype.initPowerup = function(powerup) {
	switch(powerup){
		case "Extra Time":
			powerupAttrObj = {
				name : powerup,
				type : "Magic",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "extratime.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Stop Spawn":
			powerupAttrObj = {
				name : powerup,
				type : "Magic",
				description : "Reduce the number of enemies about to spawn in the next few seconds.",
				price : 100,
				thumbnail : "stopspawn.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Void Cell":
			powerupAttrObj = {
				name : powerup,
				type : "Magic",
				description : "Void a cell so that they are no longer involved in the physics of the this world.",
				price : 100,
				thumbnail : "voidcell.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Tower":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "tower.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Blockade":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "blockade.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Shield":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "shild.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Caltrops":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "caltrops.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Archer NW":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "archernw.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Archer NE":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "archerne.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Archer SE":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "archerse.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Archer SW":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "archersw.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Infantry W":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "infantryw.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Infantry N":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "infantryn.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Infantry E":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "infantrye.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Infantry S":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "infantrys.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Wall Back":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "wallback.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;
		case "Wall Forward":
			powerupAttrObj = {
				name : powerup,
				type : "Shape",
				description : "Reduce remaining survival time by 5-10 sec.",
				price : 100,
				thumbnail : "wallforward.png"
			}
			powerMap.set(powerup, new powerup(powerupAttrObj, effect : new function(level){})
			break;		
		
	}
};