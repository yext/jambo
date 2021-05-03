const asserts = require('./asserts/asserts');
const { runInPlayground } = require('./setup/playground');
// const TestInstance = require('./setup/TestInstance');

it('works', () => runInPlayground(async t => {
  await t.jambo('init')
  asserts.strictEqual(1, 2)
}));