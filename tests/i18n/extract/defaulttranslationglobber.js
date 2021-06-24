const path = require('path');
const process = require('process');

const DefaultTranslationGlobber = require('../../../src/commands/extract-translations/defaulttranslationglobber');

const fixturesAbsPath = path.resolve(__dirname, '../../fixtures/extractions');
const fixturesDir = path.relative(process.cwd(), fixturesAbsPath);

it('can glob a single file', () => {
  const filePath = path.join(fixturesDir, 'rawcomponent.js');
  const globber = new DefaultTranslationGlobber({
    partials: [ filePath ]
  });
  expect(globber.getGlobs()).toEqual([ filePath ]);
});

it('will ignore paths that do not exist', () => {
  const globber = new DefaultTranslationGlobber({
    partials: [ 'DNE.txt' ]
  });
  expect(globber.getGlobs()).toEqual([]);
});

it('will glob partial folder paths', () => {
  const globber = new DefaultTranslationGlobber({
    partials: [ fixturesDir ]
  });
  expect(globber.getGlobs()).toEqual([`${fixturesDir}/**/*{.js,.hbs}`]);
});

it('will glob the pages folder', () => {
  const globber = new DefaultTranslationGlobber({
    pages: fixturesDir
  });
  expect(globber.getGlobs()).toEqual([`${fixturesDir}/**/*{.js,.hbs}`]);
});

it('will ignore a pages folder that does not exist', () => {
  const globber = new DefaultTranslationGlobber({
    pages: 'DNE/DNE/DNE'
  });
  expect(globber.getGlobs()).toEqual([]);
});

it('ignores paths properly', () => {
  const ignoredPaths = ['node_modules', 'static/node_modules'];
  const globber = new DefaultTranslationGlobber({}, ignoredPaths);
  expect(globber.getGlobs()).toEqual([
    '!node_modules',
    '!static/node_modules',
  ]);
});

it('can handle input w/pages + partials + gitignore', () => {
  const ignoredPaths = ['node_modules', 'static/node_modules'];
  const componentPath = path.join(fixturesDir, 'rawcomponent.js');
  const templatePath = path.join(fixturesDir, 'rawtemplate.hbs');
  const fakePath = 'DNE/DNE';
  const globber = new DefaultTranslationGlobber({
    pages: fixturesDir,
    partials: [ fixturesDir, componentPath, templatePath, fakePath ]
  }, ignoredPaths);
  expect(globber.getGlobs()).toEqual([
    'tests/fixtures/extractions/**/*{.js,.hbs}',
    'tests/fixtures/extractions/**/*{.js,.hbs}',
    'tests/fixtures/extractions/rawcomponent.js',
    'tests/fixtures/extractions/rawtemplate.hbs',
    '!node_modules',
    '!static/node_modules',
  ]);
});
