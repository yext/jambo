const Handlebars = require('handlebars');

/**
 * InvocationExtractor takes a handlebars template, and an array of
 * requested hbs helpers, and parses out an array of all
 * hbs helpers found of the requested types.
 */
class HbsHelperParser {
  constructor(helpersToParse) {
    /**
     * The helpers that should be parsed out.
     * @type {string[]}
     */
    this.helpersToParse = helpersToParse;

    /**
     * @type {Handlebars.Visitor}
     */
    this.vistor = new Handlebars.Visitor();

    /**
     * _handleMustacheStatement() is dispatched on all MustacheStatement nodes.
     * @type {Function}
     */
    this.vistor.MustacheStatement = this._handleMustacheStatement.bind(this);

    /**
     * Helper statements found in a template.
     * @type {hbs.AST.MustacheStatement[]}
     */
    this.helperStatements = [];
  }

  /**
   * Parses requested hbs helpers from a handlebars template.
   *
   * @param {string} template a handlebars template
   * @return {string[]}
   */
  parse(template) {
    this.helperStatements = [];
    const ast = Handlebars.parse(template);
    this.vistor.accept(ast);
    const lineEndIndices = this._getLineEndIndices(template);
    return this.helperStatements.map(statement =>
      this._getOriginalHelperCall(statement, lineEndIndices, template));
  }

  /**
   * _handleMustacheStatement() is called on any MustacheStatement nodes by this.visitor.
   * For MustacheStatements that are recognized as requested helpers, push them onto
   * the helper statement accumulator for later usage.
   *
   * @param {hbs.AST.MustacheStatement} statement
   */
  _handleMustacheStatement(statement) {
    const isRequestedHelper = this.helpersToParse.includes(statement.path.original);
    if (!isRequestedHelper) {
      return;
    }
    this.helperStatements.push(statement);
  }

  /**
   * Returns the end index of every line in the template.
   * For example, a template like "hi\n hello\n bye" would return
   * [3, 10, 14], which are the indices corresponding to the end
   * of each line.
   *
   * @param {string} template 
   * @returns {number[]}
   */
  _getLineEndIndices(template) {
    const splitTemplate = template.split('\n');
    const indices = [];
    splitTemplate.forEach((line, i) => {
      const previousIndex = i == 0 ? 0 : indices[i - 1];
      const isLastLine = i === splitTemplate.length - 1;
      const currentLineLength = isLastLine ? line.length : line.length + 1;
      indices.push(previousIndex + currentLineLength);
    });
    return indices;
  }

  /**
   * Gets the original value for a given MustacheStatement.
   * 
   * @param {hbs.AST.MustacheStatement} statement the statement to get the original of
   * @param {number[]} lineEndIndices the line end indices of the original template
   * @param {string} template the original template
   */
  _getOriginalHelperCall(statement, lineEndIndices, template) {
    const getIndex = ({ line, column }) => {
      const lineStart = line === 1 ? 0 : lineEndIndices[line - 2];
      return lineStart + column;
    }
    const { start, end } = statement.loc;
    const startIndex = getIndex(start);
    const endIndex = getIndex(end);
    return template.substring(startIndex, endIndex);
  }
}

module.exports = HbsHelperParser;
