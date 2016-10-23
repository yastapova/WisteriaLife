/* 
 * saveLevelScreen.js
 * saveLevelScreen object
 */

 /*
  * construct a saveLevelScreen obj with given id
  */
var saveLevelScreen = function(id) {
	screen.call(this,id);	
};

inherits(saveLevelScreen, screen);

/*
 * Override the load and hide of the parent screen
 */
saveLevelScreen.prototype.load = function() {

};

saveLevelScreen.prototype.hide = function() {
	
};