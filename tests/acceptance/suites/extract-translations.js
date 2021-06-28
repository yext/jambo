const fs = require('fs');

const { runInPlayground } = require('../setup/playground');

it('extract translations w/ default settings', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/basic-flow');
  await t.jambo('override --path translations/translation-folder');
  await t.jambo('override --path translations/lonewolf.hbs');
  fs.writeFileSync('.gitignore', '**/ignored.hbs')
  await t.jambo('extract-translations');
  const expectedPot = fs.readFileSync('messages.pot', 'utf-8');
  const actualPot = fs.readFileSync(
    '../fixtures/extract-translations/default.pot', 'utf-8');
  expect(actualPot).toEqual(expectedPot);
}));

it('extract translations w/ custom globs', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/basic-flow');
  await t.jambo('override --path translations/translation-folder');
  await t.jambo('override --path translations/lonewolf.hbs');
  fs.writeFileSync('.gitignore', '**/ignored.hbs')
  await fs.writeFileSync(
    'user-created.js',
    '{{ translateJS phrase=\'RSVP\' context=\'RSVP is a verb\' }}'
  );
  await t.jambo('extract-translations --globs \'**/ignored.hbs\' user-created.js');
  const expectedPot = fs.readFileSync('messages.pot', 'utf-8');
  const actualPot = fs.readFileSync(
    '../fixtures/extract-translations/custom-globs.pot', 'utf-8');
  expect(actualPot).toEqual(expectedPot);
}));