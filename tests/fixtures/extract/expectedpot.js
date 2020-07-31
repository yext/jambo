exports.hbs =     {
  '': {
    msgid: '',
    msgstr: [ 'Content-Type: text/plain; charset=utf-8\n' ]
  },
  'Regular translation in hbs': {
    msgid: 'Regular translation in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:2' },
    msgstr: [ '' ]
  },
  '{someVar} translation in hbs': {
    msgid: '{someVar} translation in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:3' },
    msgstr: [ '' ]
  },
  '{count} translation in hbs': {
    msgid: '{count} translation in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:6' },
    msgid_plural: '{count} translations',
    msgstr: [ '', '' ]
  },
  '{count} translation with {someVar} in hbs': {
    msgid: '{count} translation with {someVar} in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:7' },
    msgid_plural: '{count} translations with {someVar} in hbs',
    msgstr: [ '', '' ]
  }
};

exports.js = {
  '': {
    msgid: '',
    msgstr: [ 'Content-Type: text/plain; charset=utf-8\n' ]
  },
  '{count} translation in js': {
    msgid: '{count} translation in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:3' },
    msgid_plural: '{count} translations',
    msgstr: [ '', '' ]
  },
  '{count} translation with {someVar} in js': {
    msgid: '{count} translation with {someVar} in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:4' },
    msgid_plural: '{count} translations with {someVar} in js',
    msgstr: [ '', '' ]
  },
  '{someVar} translation in js': {
    msgid: '{someVar} translation in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:2' },
    msgstr: [ '' ]
  },
  'Regular translation in js': {
    msgid: 'Regular translation in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:1' },
    msgstr: [ '' ]
  }
};

exports.combined = {
  '': {
    msgid: '',
    msgstr: [ 'Content-Type: text/plain; charset=utf-8\n' ]
  },
  'Regular translation in hbs': {
    msgid: 'Regular translation in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:2' },
    msgstr: [ '' ]
  },
  '{someVar} translation in hbs': {
    msgid: '{someVar} translation in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:3' },
    msgstr: [ '' ]
  },
  '{count} translation in hbs': {
    msgid: '{count} translation in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:6' },
    msgid_plural: '{count} translations',
    msgstr: [ '', '' ]
  },
  '{count} translation with {someVar} in hbs': {
    msgid: '{count} translation with {someVar} in hbs',
    comments: { reference: 'tests/fixtures/extract/translations.hbs:7' },
    msgid_plural: '{count} translations with {someVar} in hbs',
    msgstr: [ '', '' ]
  },
  '{count} translation in js': {
    msgid: '{count} translation in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:3' },
    msgid_plural: '{count} translations',
    msgstr: [ '', '' ]
  },
  '{count} translation with {someVar} in js': {
    msgid: '{count} translation with {someVar} in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:4' },
    msgid_plural: '{count} translations with {someVar} in js',
    msgstr: [ '', '' ]
  },
  '{someVar} translation in js': {
    msgid: '{someVar} translation in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:2' },
    msgstr: [ '' ]
  },
  'Regular translation in js': {
    msgid: 'Regular translation in js',
    comments: { reference: 'tests/fixtures/extract/translations.js:1' },
    msgstr: [ '' ]
  }
};

exports.empty = {
  '': {
    msgid: '',
    msgstr: ['Content-Type: text/plain; charset=utf-8\n']
  }
};