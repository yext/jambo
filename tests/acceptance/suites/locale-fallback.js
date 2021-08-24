const fs = require('fs');

const { runInPlayground } = require('../setup/playground');

it('check locale fallback functionality for page and config files', 
  () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/locale-fallback');
  /**
   * Creates index.html.hbs and index.json following universal-standard template.
   * Also generates an empty ({}) index.es.json file, which will fallback on index.fr.json
   */
  await t.jambo('page --name index --template universal-standard --locales es');
  /**
   * Creates index.fr.html.hbs and index.fr.json following universal-fallback template.
   * Since es doesn't have an index page template, it will fallback on index.fr.html.hbs
   */
  await t.jambo('page --name index.fr --template universal-fallback');
  await t.jambo('build');

  const localePage = fs.readFileSync('public/es/index.html', 'utf-8');
  const localeFallbackPage = fs.readFileSync(
    'public/fr/index.html', 'utf-8');
  expect(localePage).toEqualHtml(localeFallbackPage);
}));