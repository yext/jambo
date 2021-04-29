#!/usr/bin/env node
const fs = require('fs');
const fsExtra = require('fs-extra');
const { assign, stringify } = require('comment-json');

/**
 * Updates the defaultTheme field in the jambo.json.
 * 
 * @param {string} themeName 
 */
function updateDefaultTheme(themeName) {
  const jamboConfig = JSON.parse(fs.readFileSync('jambo.json', 'utf-8'));
  if (jamboConfig.defaultTheme !== themeName) {
    const updatedConfig = assign({ defaultTheme: themeName }, jamboConfig);
    fs.writeFileSync('jambo.json', stringify(updatedConfig, null, 2));
  }
}

updateDefaultTheme('basic');
fs.writeFileSync('config/global_config.json', '{}');
fsExtra.copySync('themes/basic/static', 'static');