// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createFragmentsResponse } = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    let { expand } = req.query;
    expand = expand === '1' ? true : false;
    const fragmentList = await Fragment.byUser(req.user, expand);
    return res.status(200).json(createFragmentsResponse(fragmentList));
  } catch (err) {
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
