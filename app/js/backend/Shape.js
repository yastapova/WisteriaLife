/*
 * Shape.js
 *
 * Defines a Shape
 *
 */

var Shape = function(name, thumbnail, cells) {
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

Shape.prototype.setName = function(name) {
    this.name = name;
};

Shape.prototype.setThumbnail = function(thumbnail) {
    this.thumbnail = thumbnail;
};

Shape.prototype.setCells = function(cells) {
    this.cells = cells;
};

Shape.prototype.getName = function() {
    return this.name;
};

Shape.prototype.getThumbnail = function() {
    return this.thumbnail;
};

Shape.prototype.getCells = function() {
    return this.cells;
};

module.exports = Shape;
