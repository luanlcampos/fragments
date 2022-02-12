// src/routes/api/getFragmentById.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

module.exports = (req, res) => {
  const { id } = req.params;

  if (id) {
    Fragment.byId(req.user, id)
      .then((data) => {
        if (data) {
          const frag = new Fragment(data);
          res.setHeader('Content-Type', frag.mimeType);
          frag.getData().then((data) => res.status(200).send(data));
        } else {
          logger.info(`No fragment found for user: ${req.user} with the id: ${id}`);
          return res
            .status(404)
            .json(createErrorResponse(404, 'Did not found any fragment with this id'));
        }
      })
      .catch((err) => {
        logger.error(err);
        res.status(404).json(createErrorResponse(404, 'Did not found any fragment with this id'));
      });
  }
};
