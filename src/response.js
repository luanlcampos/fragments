// src/response.js

/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */
module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    // clone data into the object
    ...data,
  };
};

module.exports.createFragmentsResponse = function (data) {
  return {
    status: 'ok',
    fragments: data,
  };
};

module.exports.createFragmentResponse = function (data) {
  return {
    status: 'ok',
    fragment: data,
  };
};

/**
 * An error response looks like:
 *
 * {
 *   "status": "error",
 *   "error": {
 *     "code": 400,
 *     "message": "invalid request, missing ...",
 *   }
 * }
 */

module.exports.createErrorResponse = function (code, message) {
  return {
    status: 'error',
    error: {
      code,
      message,
    },
  };
};
