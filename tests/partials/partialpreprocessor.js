const path = require('path');
const { readFileSync } = require('file-system');

const Translator = require('../../src/i18n/translator/translator');
const PartialPreprocessor = require('../../src/partials/partialpreprocessor');
jest.mock('../../src/i18n/translator/translator')

describe('PartialPreprocessor works correctly', () => {
  Translator.mockImplementation(() => {
    return {
      translate: () => 'Bonjour',
      translateWithContext: () => 'Mail maintenant {{id1}}',
      translatePlural: () => {
        return {
          1: 'Un article {{name}}',
          many: 'Les articles {{name}}'
        };
      }
    };
  });
  const translator = new Translator();
  const partialPreprocessor = new PartialPreprocessor(translator);

  it('transpiles all "translate" invocations in a JS partial', () => {
    const rawJsPartial = readFileSync(
      path.join(__dirname, '../fixtures/partials/rawcomponent.js'), 'utf8');
    const processedJsPartial = readFileSync(
      path.join(__dirname, '../fixtures/partials/processedcomponent.js'), 'utf8');

    expect(partialPreprocessor.process(rawJsPartial)).toEqual(processedJsPartial);
  });
});