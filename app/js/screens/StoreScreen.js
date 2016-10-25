/* 
 * StoreScreen.js
 * StoreScreen object
 */

 /*
  * construct a StoreScreen obj with given id
  */
var StoreScreen = function(id) {
    Screen.call(this,id);   
};

inherits(StoreScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
StoreScreen.prototype.load = function() {

};

StoreScreen.prototype.hide = function() {
    
};