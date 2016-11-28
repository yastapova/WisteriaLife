/*
 * SaveLevelScreen.js
 * SaveLevelScreen object
 */
var Screen = require('./Screen');
var firebase = require("firebase");
var Level = require('Level');

 /*
  * construct a SaveLevelScreen obj with given id
  */
var SaveLevelScreen = function (id, level) {
    console.log("save level screen constructor!");    
    this.gameManager = require('GameManager');
    this.level = level;
    this.level.custom = "true"; // yes, its a custom level
    this.levelMisc = {}; // name, img, storyline, public, uid, author
    this.imgFile = null;

    // what do we really need to change? What fields can we directly edit the level itself?
    // Some of the manager fields were undefined when i tested, please double check
    var manager = this.gameManager.levelEditManager;
    this.level.time = manager.totalTime;
    this.level.enemyZone = manager.factionGrid;
    this.level.enemySpawns = manager.enemySpawns;
    this.level.defenseStructures = manager.defenses;
    this.level.messages = manager.messages;
    Screen.call(this, id, true);
};

inherits(SaveLevelScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
SaveLevelScreen.prototype.init = function() {
    console.log("Save levels screen init called");
    // Check to see if editing an old level
    if(this.level.allowedShapes){
        console.log("Found old data.");
        var levelRef = firebase.database().ref('/customLevels/' + this.level.id).once('value').then(function(snapshot) {
            var temp = snapshot.val();
            $('#level_title').val(snapshot.val().title).focus();
            $("label[for^='level_storyline']").addClass("active");
            $('#level_storyline').val(snapshot.val().storyline).focus();
            $("label[for^='level_title']").addClass("active");   
        });
        // Update the range for all the allowed shapes
        for(var index in this.level.allowedShapes){
            $('#' + this.level.allowedShapes[index].shape +'_num').val(this.level.allowedShapes[index].quantity);
        }        
    }

    // handle uploading image
    // Events for image upload.
  	$('#upload-image').on('click', function() {
    	$('#mediaCapture').click();
  	}.bind(this));
  	$('#mediaCapture').on('change', this.saveImage.bind(this));
  	// Save the level to firebase  	
   	$('#save-button').on('click', this.saveLevel.bind(this));
    // Go back to Level Edit Screen
    $('#cancel-button').on('click', this.cancelSaving.bind(this));

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
	// Save title, storyline, user id and user name to level misc
	this.levelMisc.title = $('#level_title').val();	
	this.levelMisc.storyline = $('#level_storyline').val();
    this.levelMisc.uid = this.gameManager.user.uid;
    this.levelMisc.author = this.gameManager.user.name;
    this.levelMisc.dateCreated = Date.now();
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

    if(this.level.allowedShapes.length < 1 ||
       this.levelMisc.title === undefined || 
       this.levelMisc.title === "" ||
       this.levelMisc.storyline === undefined ||
       this.levelMisc.storyline === "")
    {
        var title = 1;
        if(this.levelMisc.title === undefined || 
           this.levelMisc.title === "")
            title = 0;
        var story = 1;
        if(this.levelMisc.storyline === undefined || 
           this.levelMisc.storyline === "")
            story = 0;
        alert("Must have all of the following to save:\n"
            + title + "/1 Level Title\n"
            + story + "/1 Level Story\n"
            + this.level.allowedShapes.length + "/1 Allowed Unit");
        return;
    }

	// Get unique level id from fb if a new level, add unique id to user levels "array"
    if(this.level.id == "41" || this.level.id == "42" || this.level.id == "43"){
	   this.level.id = firebase.database().ref('users/' + this.gameManager.user.uid + '/levels/').push().key;
        firebase.database().ref('users/' + this.gameManager.user.uid + '/levels/').push().set(this.level.id);
    }
    // Save public/private to level misc
    if ($('#save-public').is(":checked"))
    {
        this.levelMisc.public = 1;
    }else{
        this.levelMisc.public = 0;
    }
	// Write level misc data to firebase
	firebase.database().ref('levels/' + this.level.id).set(this.level);
    firebase.database().ref('customLevels/' + this.level.id).set(this.levelMisc);

    // Upload the image to Firebase Storage 
    if(this.imgFile !== null){
    firebase.storage().ref(this.level.id + "/" + this.imgFile.name)
      .put(this.imgFile, {contentType: this.imgFile.type});
    }

	// Switch screen to public or private
	if(this.levelMisc.public === 1){ 
		this.gameManager.screenManager.switchScreens('public-custom-levels');
	}else{
		this.gameManager.screenManager.switchScreens('private-custom-levels');
	}
};

SaveLevelScreen.prototype.cancelSaving = function() {
    var manager = this.gameManager.levelEditManager;
    manager.levelTitle = this.levelMisc.title;
    manager.levelStory = this.levelMisc.storyline;
    this.gameManager.screenManager.hideScreen(this);
}

SaveLevelScreen.prototype.hide = function() {

};

module.exports = SaveLevelScreen;
