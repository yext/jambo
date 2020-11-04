/**
 * PageConfiguration contains all of the configuration information
 * needed to create a new page in a Jambo repository.
 */
class PageConfiguration {
  
constructor({ name, layout, theme, template, locales }) {
    this._name = name;
    this._layout = layout;
    this._theme = theme;
    this._template = template;
    this._locales = locales;
  }

  getName() {
    return this._name;
  }

  getLayout() {
    return this._layout;
  }

  getTheme() {
    return this._theme;
  }

  getTemplate() {
    return this._template;
  }

  getLocales() {
    return this._locales;
  }
}

module.exports = PageConfiguration;