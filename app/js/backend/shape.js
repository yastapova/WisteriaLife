/* 
 * shape.js
 * 
 * Defines a shape
 * 
 */

var shape = function(name, thumbnail, cells) {
    if(name === undefined && thumbnail === undefined && cells === undefined) {
        this.name = undefined;
        this.thumbnail = undefined;
        this.cells = undefined;
    }
    else if(name === undefined && thumbnail === undefined) {
        this.name = undefined;
        this.thumbnail = undefined;
        this.cells = cells;
    }
    else if(name === undefined && cells === undefined) {
        this.name = undefined;
        this.thumbnail = thumbnail;
        this.cells = undefined;
    }
    else if(thumbnail === undefined && cells === undefined) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.cells = cells;
    }
    else if(name === undefined) {
        this.name = undefined;
        this.thumbnail = thumbnail;
        this.cells = cells;
    }
    else if(thumbnail === undefined) {
        this.name = name;
        this.thumbnail = undefined;
        this.cells = cells;
    }
    else if(cells === undefined) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.cells = undefined;
    }
    else {
	this.name = name;
	this.thumbnail = thumbnail;
	this.cells = cells;
    }
};

shape.prototype.setName = function(name) {
    this.name = name;
};

shape.prototype.setThumbnail = function(thumbnail) {
    this.thumbnail = thumbnail;
};

shape.prototype.setCells = function(cells) {
    this.cells = cells;
};

shape.prototype.getName = function() {
    return this.name;
};

shape.prototype.getThumbnail = function() {
    return this.thumbnail;
};

shape.prototype.getCells = function() {
    return this.cells;
};
