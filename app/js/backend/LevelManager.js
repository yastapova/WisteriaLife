/* 
 * LevelManager.js
 * 
 * Manages a level
 * 
 */

var LevelManager = function(customLevel) {
    if(customLevel === undefined) {
        this.customLevel = undefined;
    }
    else {
        this.customLevel = customLevel;
    }
};

LevelManager.prototype.loadLevel = function(id) {
  
};

LevelManager.prototype.loadCustomLevel = function(id) {
    
};