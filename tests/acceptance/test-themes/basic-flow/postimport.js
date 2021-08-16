#!/usr/bin/env node
import fs from 'fs';

import fsExtra from 'fs-extra';
import { assign, stringify } from 'comment-json';

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

updateDefaultTheme('basic-flow');
fs.writeFileSync('config/global_config.json', '{}');
fsExtra.copySync('themes/basic-flow/static', 'static');