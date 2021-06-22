const fs = require('fs');

const { runInPlayground } = require('../setup/playground');

console.log = jest.fn();

it('can init -> import -> describe', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/describe');
  await t.jambo('describe');
  const expectedJSON = 
    fs.readFileSync('../fixtures/describe/describe-test.json', 'utf-8');
  expect(console.log).toHaveBeenCalledWith(expectedJSON);
}));