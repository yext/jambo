const fs = require('file-system');
const { snakeCase } = require('change-case');
const hbs = require('handlebars');
const path = require('path');

exports.SitesGenerator = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  generate() {
    const config = this.config;

    const pagesConfig = {};
    fs.recurseSync(config.dirs.config, (path, relative, filename) => {
      if (filename) {
        let pageId = snakeCase(this._stripExtension(relative));
        pagesConfig[pageId] = JSON.parse(fs.readFileSync(path));
      }
    })

    // Register needed Handlebars helpers.
    this._registerHelpers();

    // Register necessary partials.
    this._registerAllPartials(config);

    const verticalConfigs = Object.keys(pagesConfig).reduce((object, key) => {
      if (key !== 'global_config') {
        object[key] = pagesConfig[key];
      }
      return object;
    }, {});
    // Write out a file to the output directory per file in the pages directory
    fs.recurseSync(config.dirs.pages, (path, relative, filename) => {
      const pageId = filename.split('.')[0];
      if (!pagesConfig[pageId]) {
        throw new Error(`Error: No config found for page: ${pageId}`);
      }
      const pageConfig = Object.assign(
          {},
          pagesConfig[pageId],
          {
            verticalConfigs,
            global_config: pagesConfig['global_config'],
            relativePath: this._calculateRelativePath(path)
          });
      const pageLayout = pageConfig.layout;

      let template;
      if (pageLayout) {
        hbs.registerPartial('body', fs.readFileSync(path).toString());
        const layoutPath = `${config.dirs.partials}/${pageLayout}`;
        template = hbs.compile(fs.readFileSync(layoutPath).toString());
      } else {
        template = hbs.compile(fs.readFileSync(path).toString());
      }
      const result = template(pageConfig);
      const outputPath =
        `${config.dirs.output}/${this._stripExtension(relative).substring(config.dirs.pages)}`;
      fs.writeFileSync(outputPath, result);
    });
  }

  _stripExtension(fn) {
    if (fn.indexOf(".") === -1) {
      return fn;
    }
    return fn.substring(0, fn.lastIndexOf("."));
  }

  _registerPartials(directory) {
    if (fs.existsSync(directory)) {
      fs.recurseSync(directory, (path, relative, filename) => {
        if (filename) {
          const relativeNoExtension = this._stripExtension(relative);
          hbs.registerPartial(snakeCase(relativeNoExtension), fs.readFileSync(path).toString());
        }
      });
    }
  }

  _registerAllPartials({ dirs, defaultTheme}) {
    const { partials, themes, overrides, cards } = dirs;
    // If a theme is specified, register partials and overrides from it.
    if (defaultTheme) {
      for (const dir of [themes, overrides]) {
        this._registerPartials(path.resolve(dir, defaultTheme));
      }
      this._registerPartials(cards);
    }

    // Register custom partials.
    this._registerPartials(partials);
  }

  _registerHelpers() {
    hbs.registerHelper('json', function(context) {
      return JSON.stringify(context || {});
    });

    hbs.registerHelper('ifeq', function (arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });

    hbs.registerHelper('read', function (fileName) {
      return hbs.partials[fileName];
    });
  }

  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), "");
  }
}
