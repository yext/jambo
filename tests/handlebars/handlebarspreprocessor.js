const path = require('path');
const { readFileSync } = require('file-system');

const Translator = require('../../src/i18n/translator/translator');
const TemplatePreprocessor = require('../../src/handlebars/handlebarspreprocessor');
jest.mock('../../src/i18n/translator/translator')

describe('TemplatePreprocessor works correctly', () => {
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
  const templatePreprocessor = new TemplatePreprocessor(translator);

  it('transpiles all "translate" and "translateJS" invocations in a JS template', () => {
    const rawJsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/rawcomponent.js'), 'utf8');
    const processedJsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/processedcomponent.js'), 'utf8');

    expect(templatePreprocessor.process(rawJsTemplate)).toEqual(processedJsTemplate);
  });

  it('transpiles all "translate" and "translateJS" invocations in a HBS template', () => {
    const rawHbsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/rawtemplate.hbs'), 'utf8');
    const processedHbsTemplate = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/processedtemplate.hbs'), 'utf8');

    expect(templatePreprocessor.process(rawHbsTemplate)).toEqual(processedHbsTemplate);
  });
});