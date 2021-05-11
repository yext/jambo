const HbsHelperParser = require('../../src/handlebars/hbshelperparser');

it('can parse a simple helper', () => {
  const parser = new HbsHelperParser(['simpleBoy']);
  const parsedHelpers = parser.parse('{{simpleBoy phrase=\'hi\'}}');
  expect(parsedHelpers).toEqual(['{{simpleBoy phrase=\'hi\'}}']);
});

it('will ignore helpers that are not requested for', () => {
  const parser = new HbsHelperParser(['translate']);
  const parsedHelpers = parser.parse(
    '{{simpleBoy phrase=\'hi\'}} {{translate phrase=\'mimimi\'}}');
  expect(parsedHelpers).toEqual(['{{translate phrase=\'mimimi\'}}']);
});

it('can parse from a multi-line file', () => {
  const parser = new HbsHelperParser(['translate']);
  const parsedHelpers = parser.parse(
    '{{translate}}\n\n\n{{translate phrase="mimimi"}}');
  expect(parsedHelpers).toEqual([
    '{{translate}}',
    '{{translate phrase="mimimi"}}'
  ]);
});

it('can parse a multi-line helper', () => {
  const parser = new HbsHelperParser(['translate']);
  const parsedHelpers = parser.parse(
    'asdfasd\n\n{{ translate\nphrase=\'hi\'\ncontext=\'some context!!!\'\n  }}');
  expect(parsedHelpers).toEqual([
    '{{ translate\nphrase=\'hi\'\ncontext=\'some context!!!\'\n  }}'
  ]);
});