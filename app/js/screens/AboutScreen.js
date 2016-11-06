/*
 * AboutScreen.js
 * AboutScreen object
 */
var Screen = require('./Screen');

 /*
  * construct a AboutScreen obj with given id
  */
var AboutScreen = function (id) {
    Screen.call(this,id);
};

inherits(AboutScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
AboutScreen.prototype.init = function () {
    console.log("About screen load called");
};

AboutScreen.prototype.hide = function () {

};

module.exports = AboutScreen;
