const fs = require('fs');

const { runInPlayground } = require('../setup/playground');

it('can init -> import -> create page -> build', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/basic-flow');
  await t.jambo('page --name index --template universal-standard');
  await t.jambo('build');
  const actualPage = fs.readFileSync('public/index.html', 'utf-8');
  const expectedPage = fs.readFileSync(
    '../fixtures/basic-flow/index.html', 'utf-8');
  expect(actualPage).toEqualHtml(expectedPage);
}));