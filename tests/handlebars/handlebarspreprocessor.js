const path = require('path');
const { readFileSync } = require('file-system');

const LocalFileParser = require('../../src/i18n/translationfetchers/localfileparser');
const Translator = require('../../src/i18n/translator/translator');
const HandlebarsPreprocessor = require('../../src/handlebars/handlebarspreprocessor');
jest.mock('../../src/i18n/translator/translator')

describe('HandlebarsPreprocessor works correctly on a simple example', () => {
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
      },
      translatePluralWithContext: (phrase, pluralForm, context) => {
        if (context === 'male') {
          return {
            0: 'L\'homme',
            1: 'Les hommes',
            locale: 'fr-FR'
          }
        } else if (context === 'female') {
          return {
            0: 'La femme',
            1: 'Les femmes',
            locale: 'fr-FR'
          }
        }
      }
    };
  });
  const translator = new Translator();
  const handlebarsPreprocessor = new HandlebarsPreprocessor(translator);

  it('transpiles all "translate" and "translateJS" invocations in a JS template', () => {
    const rawJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/simple-example/rawcomponent.js'), 'utf8');
    const processedJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/simple-example/processedcomponent.js'), 'utf8');

    expect(handlebarsPreprocessor.process(rawJsHandlebarsContent)).toEqual(processedJsHandlebarsContent);
  });

  it('transpiles all "translate" and "translateJS" invocations in a HBS template', () => {
    const rawHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/simple-example/rawtemplate.hbs'), 'utf8');
    const processedHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/simple-example/processedtemplate.hbs'), 'utf8');

    expect(handlebarsPreprocessor.process(rawHbsHandlebarsContent)).toEqual(processedHbsHandlebarsContent);
  });

  describe('when translating a language with a single plural form', () => {
    const translatePlural = jest.fn(() => ({
      0: 'singular',
      1: 'plural',
      locale: 'en'
    }));
    Translator.mockImplementation(() => ({ translatePlural }));
    const handlebarsPreprocessor = new HandlebarsPreprocessor(new Translator());

    it('passes correct arguments to translatePlural', () => {
      const raw = `{{ translate phrase='singular' pluralForm='plural' }}`;
      const processed = `{{ runtimeTranslation phrase='{"0":"singular","1":"plural","locale":"en"}' }}`;
      expect(handlebarsPreprocessor.process(raw)).toEqual(processed);
      expect(translatePlural.mock.calls).toEqual([['singular', 'plural']]);
    });

    it('transpiles commented out "translate" invocations correctly', () => {
      const raw = `{{!-- {{ translate phrase='singular' pluralForm='plural' }} --}}`;
      const processed = 
        `{{!-- {{ runtimeTranslation phrase='{"0":"singular","1":"plural","locale":"en"}' }} --}}`;
      expect(handlebarsPreprocessor.process(raw)).toEqual(processed);
    });
  });
});

describe('HandlebarsPreprocessor works correctly on edge cases', () => {
  jest.mock('../../src/i18n/translator/translator')
  Translator.mockImplementation(() => {
    return {
      translate: (phrase) => {
        if (phrase === 'The man') {
          return 'L\'homme';
        } else if (phrase === '<span class="yext">The dog\'s bone</span>') {
          return '<span class="yext">L\'os du chien</span>';
        }
      }
    };
  });
  const translator = new Translator();
  const handlebarsPreprocessor = new HandlebarsPreprocessor(translator);

  it('transpiles all "translate" and "translateJS" invocations in a JS template', () => {
    const rawJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/edge-cases/rawcomponent.js'), 'utf8');
    const processedJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/edge-cases/processedcomponent.js'), 'utf8');

    expect(handlebarsPreprocessor.process(rawJsHandlebarsContent)).toEqual(processedJsHandlebarsContent);
  });

  it('transpiles all "translate" and "translateJS" invocations in a HBS template', () => {
    const rawHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/edge-cases/rawtemplate.hbs'), 'utf8');
    const processedHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/edge-cases/processedtemplate.hbs'), 'utf8');

    expect(handlebarsPreprocessor.process(rawHbsHandlebarsContent)).toEqual(processedHbsHandlebarsContent);
  });
});