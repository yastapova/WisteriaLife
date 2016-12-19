/*
 * StoreScreen.js
 * StoreScreen object
 */
var Screen = require('./Screen');

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
StoreScreen.prototype.init = function() {
    console.log("Store screen init called");

    // whole card clickable
    // adjust accordingly
    // #store-cards is the parent of the whole cards section
    // Each card has an ID in the format starting with store-item-...
    $('#store-cards').on('click', '[id|=store-item-]', function () {
        // buy event goes here
    });

};

module.exports = StoreScreen;
