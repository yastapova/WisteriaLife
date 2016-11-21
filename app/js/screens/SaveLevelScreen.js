/*
 * SaveLevelScreen.js
 * SaveLevelScreen object
 */
var Screen = require('./Screen');
var firebase = require("firebase");
var Level = require('Level');
var gameManager = require('../backend/GameManager');

 /*
  * construct a SaveLevelScreen obj with given id
  */
var SaveLevelScreen = function (id, level) {
    //this.level = level;
    //temp
    var levelAttrObj = {
	    id : "1",
	    grid : "1",
	    time : "1",
	    enemyZone : "1",
	    allowedShapes : "1",
	    defenseStructures : "1",	    
    	custom : "1"
    };
    this.level = new Level(levelAttrObj);
    // test rewrite level
    this.level.id = "-KX4_roCA6JTP7IYyui9";
    this.levelMisc = {}; // name, img, storyline, public, uid
    this.imgFile = null;
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
   	$('#save-button').on('click', this.saveLevel.bind(this));
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
	this.imgFile = event.target.files[0];
	// clear the selection in the file picker input (?)
	$('#image-form')[0].reset();
	$('#imgFileName').text(this.imgFile.name);
	this.levelMisc.img = this.imgFile.name;
};

SaveLevelScreen.prototype.saveLevel = function(){
	console.log("Save level called.");    
	// Save title and storyline to level misc
	this.levelMisc.title = $('#level_title').val();	
	this.levelMisc.storyline = $('#level_storyline').val();
    this.levelMisc.uid = this.gameManager.user.uid;
	// Save allowed units into level allowed shapes
	this.level.allowedShapes = [];
	var saveAllyUnits = $('#save_ally_units :input');
	for(var i = 0; i < saveAllyUnits.length; i++){
		if(saveAllyUnits[i].value !== '0'){
			this.level.allowedShapes.push(
				{
					shape : saveAllyUnits[i].id.slice(0, saveAllyUnits[i].id.indexOf("_")),
					quantity : saveAllyUnits[i].value - '0'
				});
		}
	}
	// Save public/private to level misc
	if ($('#save-public').is(":checked"))
	{
		this.levelMisc.public = 1;
	}else{
		this.levelMisc.public = 0;
	}	
	// Upload the image to Firebase Storage 
	if(this.imgFile !== null){
	firebase.storage().ref(this.gameManager.user.uid + '/' + this.imgFile.name)
	  .put(this.imgFile, {contentType: this.imgFile.type});
	}
	// Get unique level id from fb if a new level
    if(this.level.id === "41" || this.level.id === "42" || this.level.id === "43"){
	   this.level.id = firebase.database().ref('users/' + this.gameManager.user.uid + '/levels/').push().key;
    }
	console.log(this.level.id);
	// Write level misc data to firebase
	firebase.database().ref('users/' + this.gameManager.user.uid + '/levels/').push().set(this.level.id);
	firebase.database().ref('levels/' + this.level.id).set(this.level);
    firebase.database().ref('customLevels/' + this.level.id).set(this.levelMisc);
	// Switch screen to public or private
	if(this.levelMisc.public === 1){ 
		this.gameManager.screenManager.switchScreens('public-custom-levels');
	}else{
		this.gameManager.screenManager.switchScreens('private-custom-levels');
	}
};

SaveLevelScreen.prototype.hide = function() {

};

module.exports = SaveLevelScreen;
