/**
 * Utility methods and variables
 * Included first
 */


/**
 * Child inherits from parent
 */
function inherits(child, parent) {
    child.prototype = Object.create(parent.prototype);
}
