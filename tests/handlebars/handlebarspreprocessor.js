const path = require('path');
const { readFileSync } = require('file-system');

const Translator = require('../../src/i18n/translator/translator');
const HandlebarsPreprocessor = require('../../src/handlebars/handlebarspreprocessor');
jest.mock('../../src/i18n/translator/translator')

describe('HandlebarsPreprocessor works correctly', () => {
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
  const handlebarsPreprocessor = new HandlebarsPreprocessor(translator);

  it('transpiles all "translate" and "translateJS" invocations in a JS template', () => {
    const rawJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/rawcomponent.js'), 'utf8');
    const processedJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/processedcomponent.js'), 'utf8');

    expect(handlebarsPreprocessor.process(rawJsHandlebarsContent)).toEqual(processedJsHandlebarsContent);
  });

  it('transpiles all "translate" and "translateJS" invocations in a HBS template', () => {
    const rawHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/rawtemplate.hbs'), 'utf8');
    const processedHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/processedtemplate.hbs'), 'utf8');

    expect(handlebarsPreprocessor.process(rawHbsHandlebarsContent)).toEqual(processedHbsHandlebarsContent);
  });

  it('passes correct arguments to translatePlural', () => {
    const translatePlural = jest.fn(() => ({
      0: 'singular',
      1: 'plural',
      locale: 'en'
    }));
    Translator.mockImplementation(() => ({ translatePlural }));
    const handlebarsPreprocessor = new HandlebarsPreprocessor(new Translator());

    const raw = `{{ translate phrase='singular' pluralForm='plural' }}`;
    const processed = `{{ runtimeTranslation phrase='{"0":"singular","1":"plural","locale":"en"}' }}`;
    expect(handlebarsPreprocessor.process(raw)).toEqual(processed);
    expect(translatePlural.mock.calls).toEqual([['singular', 'plural']]);
  });
});
