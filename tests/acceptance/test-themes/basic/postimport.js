#!/usr/bin/env node
const fs = require('fs');
const fsExtra = require('fs-extra');
const jamboConfig = require('../../jambo.json');
const { assign, stringify } = require('comment-json');

/**
 * Updates the defaultTheme field in the jambo.json.
 * 
 * @param {Object} jamboConfig 
 * @param {string} themeName 
 */
function updateDefaultTheme(jamboConfig, themeName) {
  if (jamboConfig.defaultTheme !== themeName) {
    const updatedConfig = assign({ defaultTheme: themeName }, jamboConfig);
    fs.writeFileSync('jambo.json', stringify(updatedConfig, null, 2));
  }
}

updateDefaultTheme(jamboConfig, 'basic');
fs.writeFileSync('config/global_config.json', '{}');
fsExtra.copySync('themes/basic/static', 'static');