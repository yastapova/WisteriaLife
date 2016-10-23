/* 
 * DefeatScreen.js
 * DefeatScreen object
 */

 /*
  * construct a DefeatScreen obj with given id
  */
var DefeatScreen = function(id) {
	Screen.call(this,id);	
};

inherits(DefeatScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
DefeatScreen.prototype.load = function() {

};

DefeatScreen.prototype.hide = function() {
	
};