import fs from 'fs';
import { runInPlayground } from '../setup/playground';

it('import and execute custom commands', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/customcommand');
  await t.jambo(
      'vertical --name testvert --verticalKey testkey --template universal-standard');
  const actualPage = fs.readFileSync('index.html', 'utf-8');
  const expectedPage = fs.readFileSync(
    '../fixtures/customcommand/customcommand-test.html', 'utf-8');
  expect(actualPage).toEqualHtml(expectedPage);
}));

it('import and execute legacy custom commands', () => runInPlayground(async t => {
  await t.jambo('init');
  await t.jambo('import --themeUrl ../test-themes/customcommand');
  await t.jambo(
      'verticalLegacyArgs --name testvert --verticalKey testkey --template universal-standard');
  const actualPage = fs.readFileSync('indexLegacy.html', 'utf-8');
  const expectedPage = fs.readFileSync(
    '../fixtures/customcommand/customcommand-test.html', 'utf-8');
  expect(actualPage).toEqualHtml(expectedPage);
}));