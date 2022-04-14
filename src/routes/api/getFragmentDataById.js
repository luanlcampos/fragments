// src/routes/api/getFragmentDataById.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const { convert } = require('../../util/convertFragmentData');
const path = require('path');

module.exports = async (req, res) => {
  let { id } = req.params;
  let extension = path.parse(id).ext;
  try {
    // separate extension from id if ext exists
    if (extension !== '') {
      // get the extension
      extension = id.split('.').pop();
      if (extension === 'txt') extension = 'text/plain';
      id = path.parse(id).name;
    }
    const fragment = await Fragment.byId(req.user, id);
    if (fragment) {
      const frag = new Fragment(fragment);
      res.setHeader('Content-Type', frag.type);
      let fragData = await frag.getData();

      // check if the extension exists and if it's different than the current extension
      if (extension && extension !== frag.mimeType) {
        // check if the extension is in the allowed conversion list
        const convertOption = frag.formats.filter((ext) => ext.includes(extension));
        if (convertOption.length > 0) {
          // set the content type to the converted type
          res.setHeader('Content-Type', convertOption[0]);
          fragData = await convert(fragData, extension, frag.mimeType);
          // fragData = Buffer.from(fragData);
        } else {
          // return 415 if file conversion is not supported
          res.setHeader('Content-Type', 'application/json');
          return res.status(415).json(createErrorResponse(415, 'File conversion not supported'));
        }
      }
      res.status(200).send(fragData);
    }
  } catch (err) {
    logger.warn(err);
    res.status(404).json(createErrorResponse(404, 'Did not found any fragment with this id'));
  }
};
