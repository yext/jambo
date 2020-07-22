#!/usr/bin/env node

const vfs = require('vinyl-fs');
const { readFile, writeFile } = require('fs').promises;
const { i18nextToPot } = require('i18next-conv');
const path = require('path');
const i18nTransform = require('i18next-parser').transform;

// One pot file is generated per locale. Additional locales can be necessary
// for special cases like Arabic, which has more than 2 plural forms. An Arabic
// .pot file will generate msgstr[0], msgstr[1], ... msgstr[5], while an English
// .pot file will only generate msgstr[0] and msgstr[1].
const locales = [ 'en' ];

const options = {
  locales: locales,
  output: 'i18n/$LOCALE/$NAMESPACE.json',
  createOldCatalogs: false,
  ns: 'translation',
  lexers: {
    hbs: [
      {
        lexer: 'HandlebarsLexer',
        functions: ['translate']
      }
    ],
    js: [
      {
        lexer: 'JavascriptLexer',
        functions: ['translate']
      }
    ]
  },
}

const inputGlobs = ['**/*.{js,hbs}', '!**/node_modules/**/*'];
vfs.src(inputGlobs)
  .pipe(new i18nTransform(options))
  .pipe(vfs.dest('./'))
  .on('end', async () => {
     await Promise.all(locales.map(async locale => {
      const i18nextJson = await readFile(path.resolve('i18n', locale, 'translation.json'));
      const i18nextPot = await i18nextToPot(locale, i18nextJson, {});
      return writeFile(path.resolve('i18n', locale, 'translation.pot'), i18nextPot);
    }))
  });
