//Global Express error-handling middleware
function errorHandler(err, req, res, next) { 
  console.error(`[errorHandler] ${req.method} ${req.path} →`, err.stack || err.message);

  const statusCode = err.status || 500;

  
  const isProduction = process.env.NODE_ENV === 'production';
  const message =
    isProduction && statusCode === 500
      ? 'Internal server error'  // safe fallback
      : err.message || 'Something went wrong';


  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
}


module.exports = errorHandler;
