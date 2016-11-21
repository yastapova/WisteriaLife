/*
 * SaveLevelScreen.js
 * SaveLevelScreen object
 */
var Screen = require('./Screen');
var firebase = require("firebase");
var gameManager = require('../backend/GameManager');

 /*
  * construct a SaveLevelScreen obj with given id
  */
var SaveLevelScreen = function (id, level) {
    this.level = level;
    this.levelMisc = {}; // name, img, storyline
    this.gameManager = require('GameManager');
    Screen.call(this, id, true);
};

inherits(SaveLevelScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
SaveLevelScreen.prototype.init = function() {
    console.log("Save levels screen init called");
    // handle uploading image
    // Events for image upload.
  	$('#upload-image').on('click', function() {
    	$('#mediaCapture').click();
  	}.bind(this));
  	$('#mediaCapture').on('change', this.saveImage.bind(this));
  	// Save the level to firebase
   	$('#save-button').on('click', this.saveLevel);
    // Go back to Level Edit Screen
    $('#cancel-button').on('click', function () {
        var gameManager = require('GameManager');
        gameManager.screenManager.hideScreen(this);
    }.bind(this));

    // Output values for the ranges of the units
    $('#tower_num').on("change", function() {
    $('.output_tower').val(" x" + this.value);
    }).trigger("change");
    $('#blockade_num').on("change", function() {
    $('.output_blockade').val(" x" + this.value);
    }).trigger("change");
    $('#caltrops_num').on("change", function() {
    $('.output_caltrops').val(" x" + this.value);
    }).trigger("change");
    $('#archernw_num').on("change", function() {
    $('.output_archernw').val(" x" + this.value);
    }).trigger("change");
    $('#archerne_num').on("change", function() {
    $('.output_archerne').val(" x" + this.value);
    }).trigger("change");
    $('#archerse_num').on("change", function() {
    $('.output_archerse').val(" x" + this.value);
    }).trigger("change");
    $('#archersw_num').on("change", function() {
    $('.output_archersw').val(" x" + this.value);
    }).trigger("change");
    $('#infantryw_num').on("change", function() {
    $('.output_infantryw').val(" x" + this.value);
    }).trigger("change");
    $('#infantryn_num').on("change", function() {
    $('.output_infantryn').val(" x" + this.value);
    }).trigger("change");
    $('#infantrye_num').on("change", function() {
    $('.output_infantrye').val(" x" + this.value);
    }).trigger("change");
    $('#infantrys_num').on("change", function() {
    $('.output_infantrys').val(" x" + this.value);
    }).trigger("change");
    $('#wallbackward_num').on("change", function() {
    $('.output_wallbackward').val(" x" + this.value);
    }).trigger("change");
    $('#wallforward_num').on("change", function() {
    $('.output_wallforward').val(" x" + this.value);
    }).trigger("change");
};

SaveLevelScreen.prototype.saveImage = function(event){
	var imgFile = event.target.files[0];
	// clear the selection in the file picker input (?)
	$('#image-form')[0].reset();
	$('#imgFileName').text(imgFile.name);
	this.levelMisc.imgFile = imgFile;
};

SaveLevelScreen.prototype.saveLevel = function(){
	console.log("Save level called.");
	// Upload the image to Firebase Storage.
	firebase.storage.ref(this.gameManager.user.uid + '/' + "leveltitle" + '/' + this.levelMisc.imgFile.name)
	  .put(this.imgFile, {contentType: this.imgFile.type})
	  .then(function(snapshot) {
		// Get the file's Storage URI and update the chat message placeholder.
		var filePath = snapshot.metadata.fullPath;
		data.update({imageUrl: this.storage.ref(filePath).toString()});
	  }.bind(this)).catch(function(error) {
	console.error('There was an error uploading a file to Firebase Storage:', error);
	});
};

SaveLevelScreen.prototype.hide = function() {

};

module.exports = SaveLevelScreen;
