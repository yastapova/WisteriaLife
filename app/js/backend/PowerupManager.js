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
    this.initPowerupsMap();
    for (var i = 0; i < this.powerupsList.length; i++) {
        this.initPowerup(powerupsList[i]);
        console.log("initialized " + powerupsList[i])
    }
};

PowerupManager.prototype.initPowerupsMap = function(){
    console.log("Init powerup map called.");
    var powerupsFile =  "/data/powerups.json";  
    $.getJSON(powerupsFile, function(data){ 
        console.log("hi");
        this.loadJSONData(data);
    }.bind(this));
}

/*
 * Create a powerupAttrObj from the objs in the json file
 * and map the powerup accordingly.
 * TO DO: add the effect functions.
 */
PowerupManager.prototype.loadJSONData = function(data){
    
    for (var i = 0; i < data.powerups.length;i++){
        var powerupData = data.powerups[i];
        var powerupAttrObj = {
            name : powerupData.name,
            type : powerupData.type,
            description : powerupData.description,
            price : powerupData.price,
            thumbnail : powerupData.thumbnail
        }
        switch(powerupData.name){
            case "Extra Time":
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Stop Spawn":                  
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Void Cell":                   
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Tower":                   
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Blockade":                    
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Shield":                  
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Caltrops":                    
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Archer NW":                   
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Archer NE":                   
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Archer SE":                   
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Archer SW":                   
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Infantry W":                  
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Infantry N":                  
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Infantry E":                  
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Infantry S":                  
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Wall Backward":                   
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;
            case "Wall Forward":                    
                this.powerMap.set(powerupData.name, new Powerup(powerupAttrObj, function(level){}))
                break;  
        }
    }
}

var powerups = new PowerupManager([]);

