// Response
function response(res, httpStatus, status, message, data = null) {
  const result = {
    status,
    message,
    data,
  };
  return res.status(httpStatus).json(result);
}

module.exports = response;
