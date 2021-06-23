const registerHbsHelpers = require('../../src/handlebars/registerhbshelpers');
const hbs = require('handlebars');
registerHbsHelpers(hbs);
hbs.registerPartial('testPartial', 'this is a {{#if 1}}test{{/if}} partial');
hbs.registerPartial('cards/standard/component', 'I am a standard card');
hbs.registerPartial('cards/location/component', 'I am a location card');

it('json', () => {
  const template = hbs.compile('{{{json this}}}');
  const data = {
    aNumber: 5,
    anArray: [1, 2, 'a']
  };
  expect(template(data)).toEqual(JSON.stringify(data));
});

describe('ifeq', () => {
  it('works for equal values', () => {
    const template = hbs.compile('{{#ifeq 1 1}}equal{{/ifeq}}');
    expect(template()).toEqual('equal');
  });

  it('works for unequal values', () => {
    const template = hbs.compile('{{#ifeq 1 2}}{{else}}unequal{{/ifeq}}');
    expect(template()).toEqual('unequal');
  });
});

describe('read', () => {
  it('can read a partial that exists', () => {
    const template = hbs.compile('const partialString = `{{{ read \'testPartial\' }}}`;');
    const expectedResult =
      'const partialString = `this is a {{#if 1}}test{{/if}} partial`;';
    expect(template()).toEqual(expectedResult);
  });

  it('returns blank string for unknown partials', () => {
    const template =
      hbs.compile('const partialString = `{{{ read \'blahblahblah\' }}}`;');
    const expectedResult = 'const partialString = ``;';
    expect(template()).toEqual(expectedResult);
  });
});

describe('concat', () => {
  it('can concat two strings', () => {
    const template =
      hbs.compile('const partialString = `{{{ read (concat "test" "Partial") }}}`;');
    const expectedResult =
      'const partialString = `this is a {{#if 1}}test{{/if}} partial`;';
    expect(template()).toEqual(expectedResult)
  });
});

describe('matches', () => {
  it('matches when the string contains the regex', () => {
    const template = hbs.compile('{{#if (matches test "//")}}it matches!{{/if}}');
    const data = {
      test: 'https://yext.com'
    };
    expect(template(data)).toEqual('it matches!');
  });

  it('returns falsy when the string does not contain the regex', () => {
    const template =
      hbs.compile('{{#unless (matches test "//")}}it does NOT match{{/unless}}');
    const data = {
      test: 'www.yext.com'
    };
    expect(template(data)).toEqual('it does NOT match');
  });
});

describe('babel', () => {
  it('transpiles arrow functions', () => {
    const template =
      hbs.compile('{{#babel}}const a = () => {};{{/babel}}');
    expect(template()).toEqual('var a=function a(){};');
  });
});

describe('partialPattern', () => {
  it('can register cards', () => {
    const template = hbs.compile(`
      {{~#partialPattern '^cards/(.*)/component'}}
        {{~> (lookup . 'key') }}
      {{/partialPattern}}`);
    expect(template()).toEqual('I am a standard cardI am a location card');
  });
});

describe('deepMerge', () => {
  it('can merge three nested objects', () => {
    const template = hbs.compile('{{{json (deepMerge a b c) }}}')
    const data = {
      a: {
        count: 1,
        first: 'a',
        letter: 'a'
      },
      b: {
        count: 2,
        letter: 'b'
      },
      c: {
        count: 3,
        third: 'c'
      }
    }
    expect(template(data)).toEqual(JSON.stringify({
      count: 3,
      first: 'a',
      letter: 'b',
      third: 'c'
    }));
  });
});

describe('isNonRelativeUrl', () => {
  it('works for https://yext.com', () => {
    const template = hbs.compile('{{#if (isNonRelativeUrl url)}}is absolute!{{/if}}');
    const data = {
      url: 'https://yext.com'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('works for //yext.com', () => {
    const template = hbs.compile('{{#if (isNonRelativeUrl url)}}is absolute!{{/if}}');
    const data = {
      url: '//yext.com'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('works for /index.html', () => {
    const template = hbs.compile('{{#if (isNonRelativeUrl url)}}is absolute!{{/if}}');
    const data = {
      url: '/index.html'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('works for data: urls', () => {
    const template = hbs.compile('{{#if (isNonRelativeUrl url)}}is absolute!{{/if}}');
    const data = {
      url: 'data:image/gif;base64,R0l'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('works for mailto: urls', () => {
    const template = hbs.compile('{{#if (isNonRelativeUrl url)}}is absolute!{{/if}}');
    const data = {
      url: 'mailto:slapshot@gmail.com'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('works for tel: urls', () => {
    const template = hbs.compile('{{#if (isNonRelativeUrl url)}}is absolute!{{/if}}');
    const data = {
      url: 'tel:1-555-555-5555'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('works for relative urls', () => {
    const template =
      hbs.compile('{{#unless (isNonRelativeUrl url)}}is NOT absolute{{/unless}}');
    const data = {
      url: './index.html'
    };
    expect(template(data)).toEqual('is NOT absolute');
  });
});

describe('isAbsoluteUrl (alias of isNonRelativeUrl)', () => {
  it('works for https://yext.com', () => {
    const template = hbs.compile('{{#if (isAbsoluteUrl url)}}is absolute!{{/if}}');
    const data = {
      url: 'https://yext.com'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('works for relative urls', () => {
    const template =
      hbs.compile('{{#unless (isAbsoluteUrl url)}}is NOT absolute{{/unless}}');
    const data = {
      url: './index.html'
    };
    expect(template(data)).toEqual('is NOT absolute');
  });
});

describe('simple hbs expressions', () => {
  describe('eq', () => {
    it('works for 1 === 1', () => {
      const template = hbs.compile('{{#if (eq 1 1) }}equal{{/if}}');
      expect(template()).toEqual('equal');
    });
  
    it('works for 1 === 2', () => {
      const template = hbs.compile('{{#unless (eq 1 2) }}unequal{{/unless}}');
      expect(template()).toEqual('unequal');
    });
  });
  
  describe('ne', () => {
    it('works for 1 !== 2', () => {
      const template = hbs.compile('{{#if (ne 1 2) }}unequal{{/if}}');
      expect(template()).toEqual('unequal');
    });
  
    it('works for 1 !== 1', () => {
      const template = hbs.compile('{{#unless (ne 1 1) }}equal{{/unless}}');
      expect(template()).toEqual('equal')
    });
  });
  
  describe('lt', () => {
    it('works for 1 < 2', () => {
      const template = hbs.compile('{{#if (lt 1 2) }}1 is less than 2{{/if}}');
      expect(template()).toEqual('1 is less than 2');
    });
  
    it('works for 2 < 1', () => {
      const template =
        hbs.compile('{{#unless (lt 2 1) }}2 is not less than 1{{/unless}}');
      expect(template()).toEqual('2 is not less than 1');
    });
  });
  
  describe('lte', () => {
    it('works for 1 <= 2', () => {
      const template = hbs.compile('{{#if (lte 1 2) }}1 is less than 2{{/if}}');
      expect(template()).toEqual('1 is less than 2');
    });
  
    it('works for 2 <= 1', () => {
      const template =
        hbs.compile('{{#unless (lte 2 1) }}2 is not less than 1{{/unless}}');
      expect(template()).toEqual('2 is not less than 1');
    });
  
    it('works for 1 === 1', () => {
      const template = hbs.compile('{{#if (lte 1 1) }}equal{{/if}}');
      expect(template()).toEqual('equal')
    });
  });
  
  describe('gt', () => {
    it('works for 1 > 2', () => {
      const template = hbs.compile('{{#unless (gt 1 2) }}1 is not > 2{{/unless}}');
      expect(template()).toEqual('1 is not > 2')
    });
  
    it('works for 2 > 1', () => {
      const template = hbs.compile('{{#if (gt 2 1) }}2 is > 1{{/if}}');
      expect(template()).toEqual('2 is > 1');
    });
  });
  
  describe('gte', () => {
    it('works for 1 >= 2', () => {
      const template = hbs.compile('{{#unless (gt 1 2) }}1 is not >= 2{{/unless}}');
      expect(template()).toEqual('1 is not >= 2');
    });
  
    it('works for 2 >= 1', () => {
      const template = hbs.compile('{{#if (gt 2 1) }}2 is >= 1{{/if}}');
      expect(template()).toEqual('2 is >= 1');
    });
  
    it('works for 1 === 1', () => {
      const template = hbs.compile('{{#if (gte 1 1) }}equal{{/if}}');
      expect(template()).toEqual('equal');
    });
  });
  
  describe('and', () => {
    it('works for all truthy values', () => {
      const template = hbs.compile('{{#if (and true true 1) }}both true{{/if}}');
      expect(template()).toEqual('both true');
    });
  
    it('rejects when there is 1 falsy value', () => {
      const template = hbs.compile('{{#unless (and true 1 false) }}one false{{/unless}}');
      expect(template()).toEqual('one false');
    });
  });
  
  describe('all', () => {
    it('works for all truthy values', () => {
      const template = hbs.compile('{{#if (all true true 1) }}both true{{/if}}');
      expect(template()).toEqual('both true');
    });
  
    it('rejects when there is 1 falsy value', () => {
      const template = hbs.compile('{{#unless (all true 1 false) }}one false{{/unless}}');
      expect(template()).toEqual('one false');
    });
  });
  
  describe('or', () => {
    it('works for all falsy values', () => {
      const template = hbs.compile('{{#unless (or 0 0 false) }}all false{{/unless}}');
      expect(template()).toEqual('all false')
    });
  
    it('rejects when there is 1 falsy value', () => {
      const template = hbs.compile('{{#if (or 0 false true) }}one true{{/if}}');
      expect(template()).toEqual('one true');
    });
  });
  
  describe('any', () => {
    it('works for all falsy values', () => {
      const template = hbs.compile('{{#unless (any 0 0 false) }}all false{{/unless}}');
      expect(template()).toEqual('all false')
    });
  
    it('rejects when there is 1 falsy value', () => {
      const template = hbs.compile('{{#if (any 0 false true) }}one true{{/if}}');
      expect(template()).toEqual('one true');
    });
  });
});