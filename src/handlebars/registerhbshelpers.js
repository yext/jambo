const babel = require('@babel/core');
const lodash = require('lodash');

/**
 * Register's Jambo's built-in hbs helpers.
 *
 * @param {Handlebars} hbs the handlebars instance
 */
module.exports = function registerHbsHelpers(hbs) {
  hbs.registerHelper('json', function(context) {
    return JSON.stringify(context || {});
  });

  hbs.registerHelper('ifeq', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper({
    eq: function(v1, v2) {
      return v1 === v2;
    },
    ne: function(v1, v2) {
      return v1 !== v2;
    },
    lt: function(v1, v2) {
      return v1 < v2;
    },
    gt: function(v1, v2) {
      return v1 > v2;
    },
    lte: function(v1, v2) {
      return v1 <= v2;
    },
    gte: function(v1, v2) {
      return v1 >= v2;
    },
    and: function() {
      return Array.prototype.slice.call(arguments).every(Boolean);
    },
    or: function() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
  });

  hbs.registerHelper('read', function(fileName) {
    return hbs.partials[fileName];
  });

  hbs.registerHelper('concat', function(prefix, id) {
    return (prefix + id);
  });

  hbs.registerHelper('matches', function(str, regexPattern) {
    const regex = new RegExp(regexPattern);
    return str && str.match(regex);
  });

  /**
   * Determine whether a URL is absolute or not.
   * Common examples: "mailto:slapshot@gmail.com", "//yext.com", "https://yext.com",
   * "/my-img.svg"
   */
  function isNonRelativeUrl(str) {
    const absoluteURLRegex = /^(\/|[a-zA-Z]+:)/;
    return str && str.match(absoluteURLRegex);
  }

  hbs.registerHelper('isNonRelativeUrl', isNonRelativeUrl);

  hbs.registerHelper('isAbsoluteUrl', isNonRelativeUrl);

  hbs.registerHelper('all', function(...args) {
    return args.filter(item => item).length === args.length;
  });

  hbs.registerHelper('any', function(...args) {
    return args.filter(item => item).length > 1;
  });

  hbs.registerHelper('babel', function(options) {
    const srcCode = options.fn(this);
    
    if (process.env.IS_DEVELOPMENT_PREVIEW === 'true' ) {
      return srcCode;
    } else {
      return babel.transformSync(srcCode, {
        compact: true,
        minified: true,
        comments: false,
        sourceType: 'script',
        presets: ['@babel/preset-env'],
        plugins: [
          '@babel/syntax-dynamic-import',
          '@babel/plugin-transform-arrow-functions',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-transform-object-assign',
        ]
      }).code;
    }
  });

  hbs.registerHelper('partialPattern', function(cardPath, opt) {
    let result = '';
    Object.keys(hbs.partials)
      .filter(key => key.match(new RegExp(cardPath)))
      .map(key => {return {key}})
      .forEach(key => result += opt.fn(key));
    return result;
  });

  /**
   * Performs a deep merge of the given objects.
   */
  hbs.registerHelper('deepMerge', function(...args) {
    return lodash.merge({}, ...args.slice(0, args.length - 1));
  });
}