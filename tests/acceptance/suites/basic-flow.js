const fs = require('fs');
const path = require('path');

const { runInPlayground } = require('../setup/playground');

// silence jambo's noisy output
console.log = jest.fn();

it('works', () => runInPlayground(async t => {
  await t.jambo('init');
  const themePath = path.resolve(__dirname, '../test-themes/basic');
  await t.jambo(`import --themeUrl ${themePath}`);
  await t.jambo('page --name index --template universal-standard');
  await t.jambo('build');
  const indexPage = fs.readFileSync('public/index.html', 'utf-8');
  const expectedPage = 
    `<script>
      ANSWERS.addComponent("DirectAnswer", Object.assign({}, {
        container: "#js-answersDirectAnswer"
      }, {"dummyConfig":"dummy config"}));
    </script>
    <div
      class="Answers-directAnswer
      js-answersDirectAnswer"
      id="js-answersDirectAnswer">
    </div>`
  expect(indexPage).toEqualHtml(expectedPage);
}));