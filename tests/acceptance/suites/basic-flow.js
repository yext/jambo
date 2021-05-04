const fs = require('fs');
const path = require('path');

const { runInPlayground } = require('../setup/playground');

// silence jambo's noisy output
console.log = jest.fn();

it('can init -> import -> create page -> build', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/basic');
  await t.jambo('page --name index --template universal-standard');
  await t.jambo('build');
  const actualPage = fs.readFileSync('public/index.html', 'utf-8');
  const expectedPage = fs.readFileSync(
    '../fixtures/basic-flow/direct-answer.html', 'utf-8');
  expect(actualPage).toEqualHtml(expectedPage);
}));