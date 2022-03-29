// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

var contentType = require('content-type');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Fragment class
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Support sending various Content-Types on the body up to 5M in size

// support text/plain
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      // eslint-disable-next-line no-undef
      const { type } = contentType.parse(req);
      const test = contentType.parse(req);
      logger.debug(test);
      return Fragment.isSupportedType(type);
    },
  });

// Define POST route to send content to the endpoint: POST /v1/fragments
router.post('/fragments', rawBody(), require('./post'));

// Return a fragment data based on fragmentId (:id) for the authenticated user
router.get('/fragments/:id', require('./getFragmentDataById'));

// Return a fragment metadata based on fragmentId (:id) for the authenticated user
router.get('/fragments/:id/info', require('./getFragmentById'));

// Delete a fragment based on fragmentId (:id) for the authenticated user
router.delete('/fragments/:id', require('./deleteFragmentById'));

// Other routes will go here later on...
module.exports = router;
