// src/routes/api/updateFragmentDataById.js
const { createFragmentsResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // check if we were able to parse the file
  const { id } = req.params;

  const { type } = contentType.parse(req);
  try {
    const fragment = await Fragment.byId(req.user, id);

    // check if the fragment author is the editor
    if (fragment.ownerId !== req.user) {
      return res.status(403).json(createErrorResponse(403, 'Forbidden'));
    }
    logger.debug({ fragment, id, type }, 'PUT');
    logger.debug('mimeType: ' + fragment.mimeType + ' vs ' + type);
    // check if the fragment type is the same as the request
    if (type === fragment.type) {
      logger.debug(`Updating a fragment with the new data: ${fragment.id} -> ${req.body}`);

      fragment.setData(req.body);
      fragment.updated = new Date().toISOString();
      fragment.save();

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      // set the location response header to use the one set in the env file
      res.setHeader('Location', `${process.env.API_URL}/${fragment.id}`);

      // returns 200 with the fragment updated metadata
      return res.status(200).json(createFragmentsResponse(fragment));
    }
    return res.status(400).json(createErrorResponse(400, 'Bad Request'));
  } catch (err) {
    logger.warn(err);
    return res
      .status(400)
      .json(createErrorResponse(400, 'No fragment with this id found for this user'));
  }
};
