/**
 * Child inherits from parent
 * Sets the child's prototype equal to the parent's
 *
 * @param child child object
 * @param parent parent object
 */
function inherits(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = parent;
}

module.exports = inherits;
