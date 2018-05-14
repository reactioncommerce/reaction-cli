
/**
 * slugify a string
 * @param  {String} str  string to slugify
 * @return {String}      slugified string
 */
export function slugify(str) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
