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

    // Import theme partials and overrides if necessary
    if (config.theme) {
      const themeDir = `${config.dirs.themes}/${config.theme}`;
      this._registerPartials(themeDir);

      const overrideDir = `${config.dirs.overrides}/${config.theme}`;
      fs.existsSync(overrideDir) && this._registerPartials(overrideDir);

      const cardsDir = `${config.dirs.cards}`;
      fs.existsSync(cardsDir) && this._registerPartials(cardsDir);
    }

    // Import any additional custom partials.
    this._registerPartials(config.dirs.partials);

    // Write out a file to the output directory per file in the pages directory
    fs.recurseSync(config.dirs.pages, (path, relative, filename) => {
      const pageId = filename.split('.')[0];
      const pageConfig = Object.assign(
          {},
          pagesConfig[pageId],
          {
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
    fs.recurseSync(directory, (path, relative, filename) => {
      if (filename) {
        const relativeNoExtension = this._stripExtension(relative);
        hbs.registerPartial(snakeCase(relativeNoExtension), fs.readFileSync(path).toString());
      }
    });
  }

  _registerHelpers() {
    hbs.registerHelper('json', function(context) {
      return JSON.stringify(context || {});
    });
    hbs.registerHelper('ifeq', function (arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });
    hbs.registerHelper('registerCardComponent', function(config, currentVertical) {
      const verticalsToConfig = config.verticalsToConfig || {};
      const verticalConfig = verticalsToConfig[currentVertical];
      if (verticalConfig) {
        const cardType = verticalConfig.cardType || 'Standard';
        switch (cardType) {
          case 'Standard':
            return 'cards_standard_component';
          default:
            return `${cardType.toLowerCase()}_component`;
        }
      }
      return 'cards_standard_component';
    });
  }

  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), "");
  }
}