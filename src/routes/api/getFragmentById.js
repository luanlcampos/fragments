// src/routes/api/getFragmentById.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createFragmentResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    // check if fragment exists
    const fragment = await Fragment.byId(req.user, id);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(createFragmentResponse(fragment));
  } catch (err) {
    logger.warn(err);
    res.status(404).json(createErrorResponse(404, 'Did not found any fragment with this id'));
  }
};
