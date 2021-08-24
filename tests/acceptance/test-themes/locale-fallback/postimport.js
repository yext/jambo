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
    const updatedConfig = assign(jamboConfig, { defaultTheme: themeName });
    fs.writeFileSync('jambo.json', stringify(updatedConfig, null, 2));
  }
}

updateDefaultTheme('locale-fallback');
fs.writeFileSync('config/global_config.json', '{}');
fsExtra.copySync('themes/locale-fallback/config/locale_config.json', 
  'config/locale_config.json');
fsExtra.copySync('themes/locale-fallback/static', 'static');