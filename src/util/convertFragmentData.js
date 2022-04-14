const md = require('markdown-it')();
const sharp = require('sharp');
/**
 * Convert data from one type to another
 * @param {Buffer} data
 * @param {string} extension conversion extension
 * @param {string} mimeType fragment data type
 * @returns {string} convertedData
 */
async function convert(data, extension, mimeType) {
  if (data && extension) {
    if (extension === 'text/plain') {
      return Buffer.from(data.toString());
    } else if (mimeType.includes('markdown') && extension.toLowerCase() === 'html') {
      // convert buffered data to string and return the html content
      return Buffer.from(md.render(data.toString()));
    } else if (
      mimeType.includes('jpeg') ||
      mimeType.includes('png') ||
      mimeType.includes('gif') ||
      mimeType.includes('webp')
    ) {
      // convert buffered data to buffer and return the sharp image
      return sharp(data).toFormat(extension.toLowerCase()).toBuffer();
    }
  }
}

module.exports = { convert };
