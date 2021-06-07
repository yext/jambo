
/**
 * A test data validator hook.
 *
 * @param {Object} pageData configuration(s) of a page template
 * @returns {boolean} false if validator should throw an error
 */
 module.exports = function (pageData) {
    if(!pageData["params"]["example"]) {
        console.log('Missing Info: param example in config file(s)');
        return true; //gracefully ignore missing param on page
    }
    if(!pageData["global_config"]["experienceKey"]) {
        console.log('Missing Info: experienceKey in config file(s)');
        return false;
    }
    return true;
}
