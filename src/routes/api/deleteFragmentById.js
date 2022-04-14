// src/routes/api/deleteFragmentById.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    // check if fragment exists
    const fragment = await Fragment.byId(req.user, id);
    if (fragment) {
      await Fragment.delete(fragment.ownerId, fragment.id);
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    logger.warn(err);
    res.status(404).json(createErrorResponse(404, 'Did not found any fragment with this id'));
  }
};
