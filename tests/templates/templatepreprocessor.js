const path = require('path');
const { readFileSync } = require('file-system');

const Translator = require('../../src/i18n/translator/translator');
const PartialPreprocessor = require('../../src/templates/templatepreprocessor');
jest.mock('../../src/i18n/translator/translator')

describe('PartialPreprocessor works correctly', () => {
  Translator.mockImplementation(() => {
    return {
      translate: () => 'Bonjour',
      translateWithContext: () => 'Mail maintenant [[id1]]',
      translatePlural: () => {
        return {
          0: 'Un article [[name]]',
          1: 'Les articles [[name]]',
          locale: 'fr-FR'
        };
      }
    };
  });
  const translator = new Translator();
  const partialPreprocessor = new PartialPreprocessor(translator);

  it('transpiles all "translate" and "translateJS" invocations in a JS template', () => {
    const rawJsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/templates/rawcomponent.js'), 'utf8');
    const processedJsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/templates/processedcomponent.js'), 'utf8');

    expect(partialPreprocessor.process(rawJsTemplate)).toEqual(processedJsTemplate);
  });

  it('transpiles all "translate" and "translateJS" invocations in a HBS template', () => {
    const rawHbsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/templates/rawtemplate.hbs'), 'utf8');
    const processedHbsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/templates/processedtemplate.hbs'), 'utf8');

    expect(partialPreprocessor.process(rawHbsTemplate)).toEqual(processedHbsTemplate);
  });
});