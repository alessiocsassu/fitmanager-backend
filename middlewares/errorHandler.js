const logger = require("../logger");

function errorHandler(err, req, res, next) {
  logger.error(err.message);

  const status = err.status || 500;

  res.status(status).json({
    error: err.message || "Internal Server Error",
    details: err.details || null,
  });
}

module.exports = errorHandler;