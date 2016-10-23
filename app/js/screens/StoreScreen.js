/* 
 * storeScreen.js
 * storeScreen object
 */

 /*
  * construct a storeScreen obj with given id
  */
var storeScreen = function(id) {
	screen.call(this,id);	
};

inherits(storeScreen, screen);

/*
 * Override the load and hide of the parent screen
 */
storeScreen.prototype.load = function() {

};

storeScreen.prototype.hide = function() {
	
};