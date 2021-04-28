const fs = require('fs');
const asserts = require('../asserts/asserts');

exports['init -> build flow'] = async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/basic');
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
  asserts.isEqualHtml(indexPage, expectedPage)
};
