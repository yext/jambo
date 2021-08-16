import process from 'process';
import gitFactory from 'simple-git/promise';
const git = gitFactory();
import { runInPlayground } from '../setup/playground';
import ThemeManager from '../../../src/utils/thememanager';
import path from 'path';

ThemeManager.getRepoForTheme = () => {
  return path.resolve(__dirname, '../test-themes/basic-flow');
};

//Silence error logs
const error = console.error;
console.error = jest.fn();
afterAll(() => console.error = error);

it('tests upgrade fail', () => runInPlayground(async t => {
  await git.cwd(process.cwd());
  await t.jambo('init');
  await t.jambo(
    'import --themeUrl ../test-themes/basic-flow');
  await git.add('.');
  await git.commit('theme');
  await expect(t.jambo('upgrade --branch fail')).rejects.toThrow(
    /Remote branch fail not found in upstream origin/);
  const diff = await git.diff();
  expect(diff).toBe('');
}));

