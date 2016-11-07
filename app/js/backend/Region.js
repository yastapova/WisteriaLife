/*
 * Region.js
 *
 * Defines a Region
 *
 */

var Region = function (regionAttrObj) {
	this.name = regionAttrObj.name;
	this.img = regionAttrObj.img;
    this.levelsArray = regionAttrObj.levels;
};

module.exports = Region;
