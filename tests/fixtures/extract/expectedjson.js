exports.hbs = {
  'Regular translation in hbs': '',
  '{someVar} translation in hbs': '',
  '{count} translation in hbs': '',
  '{count} translation in hbs_plural': '',
  '{count} translation with {someVar} in hbs': '',
  '{count} translation with {someVar} in hbs_plural': '',
  'Translation with context in hbs_This is a test translation': '',
  '{another} translation with context in hbs_This is another test translation with context in hbs': '',
  '{count} plural translation with context in hbs_This is a plural translation with context': '',
  '{count} plural translation with context in hbs_This is a plural translation with context_plural': ''
};

exports.js = {
  'Regular translation in js': '',
  '{someVar} translation in js': '',
  '{count} translation in js': '',
  '{count} translation in js_plural': '',
  '{count} translation with {someVar} in js': '',
  '{count} translation with {someVar} in js_plural': '',
  'Translation with context in js_This is a test translation': '',
  '{another} translation with context in js_This is another test translation with context in js': '',
  '{count} plural translation with context in js_This is a plural translation with context': '',
  '{count} plural translation with context in js_This is a plural translation with context_plural': ''
};

exports.combined = Object.assign({}, exports.js, exports.hbs);

exports.empty = {};
