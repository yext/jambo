#!/usr/bin/env node
const { spawnSync } = require('child_process');
const globby = require('globby');
const { GettextExtractor, JsExtractors } = require('gettext-extractor');

/**
 * Extracts i18n strings from .js files to an output file (defaulting to message.pot),
 * then extracts i18n strings from .hbs files and appends to that output file.
 * @param {Array.<string>} options.files
 * @param {Array.<string>} options.directories
 * @param {Array.<string>} options.ignore
 * @param {string} options.output
 */
module.exports = async function (options) {
  const optionsWithDefaulting = {
    files: [],
    directories: [],
    ignore: [],
    output: 'messages.pot',
    ...options
  };
  extractJsToPot(optionsWithDefaulting);
  await appendHbsToPot(optionsWithDefaulting);
}

function extractJsToPot(options) {
  const extractor = new GettextExtractor();

  const jsParser = extractor.createJsParser([
    JsExtractors.callExpression('translate', {
      arguments: {
        text: 0
      }
    }),
    JsExtractors.callExpression('translateN', {
      arguments: {
        text: 0,
        textPlural: 1
      }
    }),
    JsExtractors.callExpression('translateC', {
      arguments: {
        text: 0,
        context: 1
      }
    }),
    JsExtractors.callExpression('translateCN', {
      arguments: {
        text: 0,
        textPlural: 1,
        context: 2
      }
    })
  ]);
  options.directories.forEach(dirpath => {
    const directoryGlob = `${dirpath}/**/*.js`;
    jsParser.parseFilesGlob(directoryGlob, { ignore: options.ignore });
  });

  extractor.savePotFile(options.output);
}

async function appendHbsToPot(options) {
  const directoryGlobs = options.directories.map(dirpath => `${dirpath}/**/*.hbs`);
  const ignoreGlobs = options.ignore.map(dirpath => `!${dirpath}`);
  const files = await globby([...directoryGlobs, ...options.files, ...ignoreGlobs]);

  // For more detail see https://github.com/gmarty/xgettext
  const args = [
    ...files,
    '--output', options.output,
    '--keyword', 'translate, translateN:1,2, translateC:1,2c, translateCN:1,2,3c',
    '--join-existing', true
  ];
  spawnSync('npx', ['xgettext-template', ...args]);
}
