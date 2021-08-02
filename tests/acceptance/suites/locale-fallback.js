const fs = require('fs');

const { runInPlayground } = require('../setup/playground');

it('check locale fallback functionality for page and config files', 
  () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/locale-fallback');
  await t.jambo('page --name index --template universal-standard --locales es');
  await t.jambo('page --name index.fr --template universal-fallback');
  await t.jambo('build');

  const localePage = fs.readFileSync('public/es/index.html', 'utf-8');
  const localeFallbackPage = fs.readFileSync(
    'public/fr/index.html', 'utf-8');
  expect(localePage).toEqualHtml(localeFallbackPage);
}));