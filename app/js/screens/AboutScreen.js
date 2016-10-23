/* 
 * aboutScreen.js
 * aboutScreen object
 */

 /*
  * construct a aboutScreen obj with given id
  */
var aboutScreen = function(id) {
	screen.call(this,id);	
};

inherits(aboutScreen, screen);

/*
 * Override the load and hide of the parent screen
 */
aboutScreen.prototype.load = function() {

};

aboutScreen.prototype.hide = function() {
	
};