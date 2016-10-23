/* 
 * defeatScreen.js
 * defeatScreen object
 */

 /*
  * construct a defeatScreen obj with given id
  */
var defeatScreen = function(id) {
	screen.call(this,id);	
};

inherits(defeatScreen, screen);

/*
 * Override the load and hide of the parent screen
 */
defeatScreen.prototype.load = function() {

};

defeatScreen.prototype.hide = function() {
	
};