const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

exports.PageWriter = class {
  constructor(config) {
    this.pagesConfig = config.pagesConfig;
    this.verticalConfigs = config.verticalConfigs;
    this.global_config = config.global_config;

    this.pagesDirectory = config.pagesDirectory;
    this.partialsDirectory = config.partialsDirectory;
    this.outputDirectory = config.outputDirectory;

    this.env = config.env;
    this.pageParamsFromLocale = config.pageParamsFromLocale;

    this.urlFormatter = config.urlFormatter;
    this.locale = config.locale;
  }

  writePages() {
    let pageIdToTemplatePath = this._buildPageIdToTemplatePath();

    // TODO this should technically only loop through the files for the locale we're currently on...
    // this will reallyyyy slow down if we're looping through every page for every locale

    // Write out a file to the output directory per file in the pages directory
    fs.recurseSync(this.pagesDirectory, (path, relative, filename) => {
      if (this._isValidFile(filename)) {
        const pageId = filename.split('.')[0];
        const pageConfig = this.pagesConfig[pageId];

        // Ensure page config exists
        this._ensurePageExists(pageConfig, pageId);

        // Combine all config to build args for the template
        const templateArguments = this._buildArgsForTemplate(pageConfig, path);

        // Get template for page based on layout!
        const pageLayout = templateArguments.layout; // TODO hmm
        let template = this._getTemplate(pageLayout, pageIdToTemplatePath[pageId]);

        // Compile the hbs
        const outputHTML = template(templateArguments);

        // Actually write file
        console.log(`Writing output file for the '${pageId}' page`);
        this._writeFile(
          this._getPageUrl(pageId, path),
          outputHTML
        );
      }
    });
  }

  // TODO this func is so messy
  _buildPageIdToTemplatePath() {
    let pageIdToTemplateExists = {};
    fs.recurseSync(this.pagesDirectory, (path, relative, filename) => {
      const pageId = filename.split('.')[0];
      let localeForPage = this._getLocaleFromPageName(filename);
      pageIdToTemplateExists[pageId] = pageIdToTemplateExists[pageId] || localeForPage === this.locale;
    });

    let pageIdToTemplatePath = {};
    fs.recurseSync(this.pagesDirectory, (path, relative, filename) => {
      const pageId = filename.split('.')[0];
      let localeForPage = this._getLocaleFromPageName(filename);
      let localizedPageTemplateExists = pageIdToTemplateExists[pageId];

      if (localeForPage === this.locale || !localizedPageTemplateExists) {
        pageIdToTemplatePath[pageId] = path;
      }
    });

    return pageIdToTemplatePath;
  }

  _getLocaleFromPageName(filename) {
    let pageParts = this._stripExtension(this._stripExtension(filename)).split('.');
    return pageParts.length > 1 && pageParts[1];
  }

  _getTemplate(pageLayout, path) {
    if (!pageLayout) {
      return hbs.compile(fs.readFileSync(path).toString());
    }

    // TODO do we ever hit this and what does it do??
    hbs.registerPartial('body', fs.readFileSync(path).toString());
    const layoutPath = `${this.partialsDirectory}/${pageLayout}`;
    return hbs.compile(fs.readFileSync(layoutPath).toString());
  }

  _ensurePageExists(pageConfig, pageId) {
    if (!pageConfig) {
      throw new Error(`Error: No config found for page: ${pageId}`);
    }
  }

  _buildArgsForTemplate(pageConfig, path) {
    return Object.assign(
      {},
      this.pageParamsFromLocale || {},
      pageConfig,
      {
        verticalConfigs: this.verticalConfigs,
        global_config: this.globalConfig,
        relativePath: this._calculateRelativePath(path), // TODO why not use fileSync's relative path for this??
        env: this.env
     }
    );
  }

  _getPageUrl(pageId, path) {
    let pageUrlWithoutHbsExtension = this._stripExtension(path);
    let pageExt = pageUrlWithoutHbsExtension.substring(pageUrlWithoutHbsExtension.lastIndexOf('.') + 1); // TODO this seems like a hack
    let urlFormatter = this.urlFormatter || ((page, extension) => `${page}.${extension}`);
    return `${this.outputDirectory}/${urlFormatter(pageId, pageExt)}`;
  }

  _writeFile(outputPath, outputHTML) {
    fs.writeFileSync(outputPath, outputHTML);
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