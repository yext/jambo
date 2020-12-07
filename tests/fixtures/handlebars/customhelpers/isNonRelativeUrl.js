/**
 * Determine whether a URL is relative or not.
 * Common examples: "mailto:slapshot@gmail.com", "//yext.com", "https://yext.com",
 * "/my-img.svg"
 */
module.exports = function isNonRelativeUrl(str) {
  const absoluteURLRegex = /^(\/|[a-zA-Z]+:)/;
  return str && str.match(absoluteURLRegex);
}