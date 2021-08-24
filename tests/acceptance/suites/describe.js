const fs = require('fs');

const { runInPlayground } = require('../setup/playground');

console.log = jest.fn();

it('describe on default and custom commands', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/customcommand');
  await t.jambo('describe');
  const receivedJSON = JSON.parse(console.log.mock.calls[0][0]);
  const expectedJSON = 
    JSON.parse(fs.readFileSync('../fixtures/describe/describe-test.json', 'utf-8'));
  expect(receivedJSON).toEqual(expectedJSON);
}));