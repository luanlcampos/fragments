// src/routes/api/getFragmentById.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    const fragment = await Fragment.byId(req.user, id);
    if (fragment) {
      const frag = new Fragment(fragment);
      res.setHeader('Content-Type', frag.mimeType);
      const fragData = await frag.getData();
      res.status(200).send(fragData);
    }
  } catch (err) {
    logger.warn(err);
    res.status(404).json(createErrorResponse(404, 'Did not found any fragment with this id'));
  }
};
