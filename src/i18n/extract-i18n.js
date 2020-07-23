#!/usr/bin/env node
const { spawnSync } = require('child_process')
const glob = require('glob')
const { GettextExtractor, JsExtractors } = require('gettext-extractor');

const extractor = new GettextExtractor();

extractor
  .createJsParser([
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
  ])
  .parseFilesGlob('**/*.js', { ignore: '**/node_modules/**/*' });

extractor.savePotFile('messages.pot');

glob('**/*.hbs', { ignore: '**/node_modules/**/*' }, (err, files) => {
  // See --keyword under 
  // https://www.gnu.org/software/gettext/manual/gettext.html#Language-specific-options.
  const keywords = ['-k', 'translate, translateN:1,2, translateC:1,2c, translateCN:1,2,3c'];

  const output = ['-o', 'messages.pot'];
  const join = ['-j', true];
  const args = ['xgettext-template', ...files, ...output, ...keywords, ...join];
  spawnSync('npx', args);
});
