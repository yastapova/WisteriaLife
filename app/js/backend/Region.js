/*
 * Region.js
 *
 * Defines a Region
 *
 */

var Region = function (regionAtrrObj) {
	this.name = regionAtrrObj.name;
	this.img = regionAtrrObj.img;
    this.levelsArray = regionAtrrObj.levels;
}

module.exports = Region;
