/* 
 * Powerup.js
 * Defines a Powerup object given a mapping of powerup attributes and an effect function
 */

 /*
  * construct a powerup obj with given attributes and effect
  */
var Powerup = function(powerupAttrObj, effect) {
    this.name = powerupAttrObj.name;
    this.type = powerupAttrObj.type;
    this.description = powerupAttrObj.description;
    this.price = powerupAttrObj.price;
    this.thumbnail = powerupAttrObj.thumbnail
    this.effect = effect;
};

