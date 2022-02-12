// src/routes/api/post.js
const { createFragmentsResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');

module.exports = (req, res) => {
  // check if we were able to parse the file
  if (Object.keys(req.body) !== 0 && Buffer.isBuffer(req.body)) {
    const { type } = contentType.parse(req);
    logger.info(`Creating a new fragment with the request data`);
    const fragment = new Fragment({
      id: null,
      ownerId: req.user,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      type,
      size: Buffer.byteLength(req.body),
    });

    fragment.setData(req.body);
    fragment.save();

    // res.setHeader('Content-Type', fragment.mimeType);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    // set the location response header to use the one set in the env file
    res.setHeader('Location', `${process.env.API_URL}/${fragment.id}`);

    // returns 201 with the fragment metadata
    return res.status(201).json(createFragmentsResponse(fragment));
  }

  logger.error(`${contentType.parse(req).type} is not supported`);
  return res.status(415).json(createErrorResponse(415, 'File format is not supported'));
};
