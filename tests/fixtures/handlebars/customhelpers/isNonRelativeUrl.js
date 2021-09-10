/**
 * Determine whether a URL is relative or not.
 * Common examples: "mailto:slapshot@gmail.com", "//yext.com", "https://yext.com",
 * "/my-img.svg"
 */
export default function isNonRelativeUrl(str) {
  const absoluteURLRegex = /^(\/|[a-zA-Z]+:)/;
  return str && str.match(absoluteURLRegex);
};