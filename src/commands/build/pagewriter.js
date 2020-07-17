const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

exports.PageWriter = class {
  constructor(config) {
    this.config = config;
  }

  _writePages(opts) {
    // Write out a file to the output directory per file in the pages directory
    fs.recurseSync(opts.pagesDirectory, (path, relative, filename) => {
      if (this._isValidFile(filename)) {
        const pageId = filename.split('.')[0];

        if (!opts.pagesConfig[pageId]) {
          throw new Error(`Error: No config found for page: ${pageId}`);
        }

        console.log(`Writing output file for the '${pageId}' page`);
        const pageConfig = Object.assign(
          {},
          opts.pageParamsFromLocale || {},
          opts.pagesConfig[pageId],
          {
            verticalConfigs: opts.verticalConfigs,
            global_config: opts.globalConfig,
            relativePath: this._calculateRelativePath(path),
            env: opts.env
          });
        const pageLayout = pageConfig.layout;

        let template;
        if (pageLayout) {
          hbs.registerPartial('body', fs.readFileSync(path).toString());
          const layoutPath = `${opts.partialsDirectory}/${pageLayout}`;
          template = hbs.compile(fs.readFileSync(layoutPath).toString());
        } else {
          template = hbs.compile(fs.readFileSync(path).toString());
        }

        const pageNameWithExtension = this._stripExtension(relative).substring(opts.pagesDirectory);
        const result = template(pageConfig);

        let pageNameParts = pageNameWithExtension.split('.');
        let pageName = pageNameParts[0] || ''; // TODO this only works if the page name has two parts!
        let pageExt = pageNameParts[1] || '';
        let urlFormatter = opts.urlFormatter || ((page, extension) => `${page}.${extension}`);
        const outputPath =
          `${opts.outputDirectory}/${urlFormatter(pageName, pageExt)}`;
        fs.writeFileSync(outputPath, result);

      }
    });
  }

  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), "");
  }

  _isValidFile(fileName) {
    return fileName && !fileName.startsWith('.');
  }

  _stripExtension(fn) {
    if (fn.indexOf(".") === -1) {
      return fn;
    }
    return fn.substring(0, fn.lastIndexOf("."));
  }
}