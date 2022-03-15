const md = require('markdown-it')();
/**
 * Convert data from one type to another
 * @param {Buffer} data
 * @param {string} extension conversion extension
 * @param {string} mimeType fragment data type
 * @returns {string} convertedData
 */
function convert(data, extension, mimeType) {
  if (data && extension) {
    if (mimeType.includes('markdown') && extension.toLowerCase() === 'html') {
      // convert buffered data to string and return the html content
      return md.render(data.toString());
    }

    // more conversion to be add in the future
  }
}

module.exports = { convert };
