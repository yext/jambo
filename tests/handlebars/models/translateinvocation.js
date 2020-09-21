const TranslateInvocation = require('../../../src/handlebars/models/translateinvocation');

describe('TranslateInvocation can parse translate helper calls', () => {
  it('works for the correct invoked helper', () => {
    const phrase = 'We. Live! In: A, Society?.';
    const translateCall = TranslateInvocation.from(`{{ translate phrase='${phrase}' }}`);
    expect(translateCall.getInvokedHelper()).toEqual('translate');
    const translateJSCall = TranslateInvocation
      .from(`{{ translateJS phrase='${phrase}' }}`);
    expect(translateJSCall.getInvokedHelper()).toEqual('translateJS');
  });

  it('works for the phrase', () => {
    const phrase = 'We. Live! In: A, Society?.';
    const invocation = TranslateInvocation.from(`{{ translate phrase='${phrase}' }}`)
    expect(invocation.getPhrase()).toEqual(phrase);
  });

  it('can detect a plural translate call', () => {
    const phrase = '[[count]] cookie crisp.';
    const pluralForm = '[[count]] cookie crispers.';
    const invocation = TranslateInvocation.from(`{{translate
      phrase='${phrase}'
      pluralForm='${pluralForm}'
      count=1000000
    }}`)
    expect(invocation.isUsingPluralization()).toBeTruthy();
  });
});

describe('TranslationInvocation parses Hash parameters (except SubExpressions)', () => {
  it('works for StringLiterals (wrapped in quotes)', () => {
    const phrase = 'Please, [[relative]], pass the [[kitchenAppliance]].';
    const invocation = TranslateInvocation.from(`{{translate
      phrase='${phrase}'
      relative='card.relative'
      kitchenAppliance='slapchop'
    }}`)
    expect(invocation.getInterpolationParams()).toEqual({
      kitchenAppliance: 'slapchop',
      relative: 'card.relative'
    });
  });

  it('works for PathExpressions (not wrapped in quotes)', () => {
    const phrase = 'Please, [[relative]], pass the [[kitchenAppliance]].';
    const invocation = TranslateInvocation.from(`{{translate
      phrase='${phrase}'
      relative=card.relative
      kitchenAppliance=slapchop
    }}`)
    expect(invocation.getInterpolationParams()).toEqual({
      kitchenAppliance: 'slapchop',
      relative: 'card.relative'
    });
  });

  it('works for BooleanLiterals', () => {
    const phrase = '{{booleanLiteral}}';
    const invocation = TranslateInvocation.from(`{{translate
      phrase='${phrase}'
      booleanLiteral=false
    }}`)
    expect(invocation.getInterpolationParams()).toEqual({
      booleanLiteral: 'false'
    });
  });

  it('works for NumberLiterals', () => {
    const phrase = '{{numberLiteral}}';
    const invocation = TranslateInvocation.from(`{{translate
      phrase='${phrase}'
      numberLiteral=117
    }}`)
    expect(invocation.getInterpolationParams()).toEqual({
      numberLiteral: '117'
    });
  });

  it('works for UndefinedLiterals', () => {
    const phrase = '{{undefinedLiteral}}';
    const invocation = TranslateInvocation.from(`{{translate
      phrase='${phrase}'
      undefinedLiteral=undefined
    }}`)
    expect(invocation.getInterpolationParams()).toEqual({
      undefinedLiteral: 'undefined'
    });
  });

  it('works for NullLiterals', () => {
    const phrase = '{{nullLiteral}}';
    const invocation = TranslateInvocation.from(`{{translate
      phrase='${phrase}'
      nullLiteral=null
    }}`)
    expect(invocation.getInterpolationParams()).toEqual({
      nullLiteral: 'null'
    });
  });
});

describe('TranslationInvocation throws correct errors for invalid invocations', () => {
  it('errors when given just a ContentStatement', () => {
    const invocation = 'this is a ContentStatement';
    expect(() => TranslateInvocation.from(invocation)).toThrow();
  });

  it('errors when given invalid hbs', () => {
    const invocation = '{{#if}}{{#if}}';
    expect(() => TranslateInvocation.from(invocation)).toThrow();
  });

  it('errors when given just a block helper', () => {
    const invocation = '{{#if true}}blah{{/if}}';
    expect(() => TranslateInvocation.from(invocation)).toThrow();
  });

  it('errors when given a template with multiple AST nodes', () => {
    const helper = '{{translate phrase=\'a phrase\'}}'
    const invocation = `${helper} ${helper}`;
    expect(() => TranslateInvocation.from(invocation)).toThrow();
  });

  it('errors when given a SubExpression parameter', () => {
    const invocation = `{{translate
      phrase='This phrase contains a {{subExpression}}'
      subExpression=(concat 'first half ' 'second half')
    }}`;
    const createInvocation = () => TranslateInvocation.from(invocation);
    expect(createInvocation).toThrow();
  });

  it('errors when given a blank string', () => {
    const createInvocation = () => TranslateInvocation.from('');
    expect(createInvocation).toThrow();
  });
});
