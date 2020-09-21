const Page = require('../../src/models/page');
const PageConfig = require('../../src/models/pageconfig');
const PageUniquenessValidator = require('../../src/validation/pageuniquenessvalidator');
const UserError = require('../../src/errors/usererror');

describe('PageUniquenessValidator validates a set of pages properly', () => {
  it('validation succeeds when there are no duplicate pages', () => {
    const pages = [
      new Page({
        pageConfig: new PageConfig({
          locale: 'en',
          pageName: 'home'
        }),
        outputPath: '/en/home.html'
      }),
      new Page({
        pageConfig: new PageConfig({
          locale: 'es',
          pageName: 'home'
        }),
        outputPath: '/es/home.html'
      })
    ];

    // Expect this not to error, any return value is OK.
    expect(() => new PageUniquenessValidator().validate(pages));
  });

  it('validation fails when there are duplicate (page, locale) combinations', () => {
    const pages = [
      new Page({
        pageConfig: new PageConfig({
          locale: 'en',
          pageName: 'home'
        }),
        outputPath: '/en/home.html'
      }),
      new Page({
        pageConfig: new PageConfig({
          locale: 'en',
          pageName: 'home'
        }),
        outputPath: '/override/home.html'
      })
    ];

    expect(() => new PageUniquenessValidator().validate(pages)).toThrow(UserError);
  });

  it('validation fails when there are output path collisions', () => {
    const pages = [
      new Page({
        pageConfig: new PageConfig({
          locale: 'en',
          pageName: 'home'
        }),
        outputPath: '/override/home.html'
      }),
      new Page({
        pageConfig: new PageConfig({
          locale: 'es',
          pageName: 'home'
        }),
        outputPath: '/override/home.html'
      })
    ];
    expect(() => new PageUniquenessValidator().validate(pages)).toThrow(UserError);
  });
});