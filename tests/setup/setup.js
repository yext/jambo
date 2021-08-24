const prettier = require('prettier');
const { setLogLevel } = require('../../src/utils/logger');
process.env.IS_DEVELOPMENT_PREVIEW = 'false';

setLogLevel('silent');

expect.extend({
  toEqualHtml: function(received, expected) {
    const normalize = html => {
      return prettier.format(html, { parser: 'html' });
    };
    const pass = normalize(received) === normalize(expected)
    if (pass) {
      return {
        message: () => `expected ${received} to not equal ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to equal ${expected}`,
        pass: false,
      };
    }
  }
});