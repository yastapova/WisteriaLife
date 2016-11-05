/*
 * Shape.js
 *
 * Defines a Shape
 *
 */

var Shape = function (shapeAtrrObj) {
	this.name = shapeAtrrObj.name;
	this.pixelsArray = this.convertToPixelsArray(shapeAtrrObj.coordinates);
}

/*
 * Initializes the pixels array from the coordinates in the shapeAtrrObj
 */
Shape.prototype.convertToPixelsArray = function (coordinates) {
	var pixels = new Array();
	var pixelsArrayCounter = 0;
	for (var i = 0; i < coordinates.length; i++) {
		pixels[pixelsArrayCounter] = coordinates[i].x;
		pixels[pixelsArrayCounter + 1] = coordinates[i].y;
		pixelsArrayCounter += 2;
	}
	return pixels;
}

module.exports = Shape;
