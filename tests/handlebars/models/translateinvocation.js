const TranslateInvocation = require('../../../src/handlebars/models/translateinvocation');

describe('TranslateInvocation correctly parses translate helper calls', () => {
  it('can parse out the correct invoked helper', () => {
    const phrase = 'We. Live! In: A, Society?.';
    const translateCall = TranslateInvocation.from(`{{ translate phrase='${phrase}' }}`);
    expect(translateCall.getInvokedHelper()).toEqual('translate');
    const translateJSCall = TranslateInvocation.from(`{{ translateJS phrase='${phrase}' }}`);
    expect(translateJSCall.getInvokedHelper()).toEqual('translateJS');
  });

  it('can parse out the phrase', () => {
    const phrase = 'We. Live! In: A, Society?.';
    const invocation = TranslateInvocation.from(`{{ translate phrase='${phrase}' }}`)
    expect(invocation.getPhrase()).toEqual(phrase);
  });

  it('can parse out StringLiteral (wrapped in quotes) interpolation parameters', () => {
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

  it('can parse out PathExpression (not wrapped in quotes) interpolation parameters', () => {
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
