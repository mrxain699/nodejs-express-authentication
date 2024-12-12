const successResponse = (res, message, data = null) => {
  return res.status(200).json({
    success: true,
    message: message,
    errors: null,
    data: data,
  });
};

const errorResponse = (res, message, errors = null) => {
  return res.status(400).json({
    success: false,
    message: message,
    errors: errors,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
