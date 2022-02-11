// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createFragmentsResponse } = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  try {
    const fragmentList = await Fragment.byUser(req.user);
    return res.status(200).json(createFragmentsResponse(fragmentList));
  } catch (err) {
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
