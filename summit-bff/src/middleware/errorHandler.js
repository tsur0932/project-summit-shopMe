import { logger } from '../log.js';


export function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl, timestamp: new Date().toISOString() });
}


export function errorHandler(err, req, res, next) {
  logger.error('[BFF] Error', {
    message: err.message,
    stack: err.stack,
    status: err.status || err.response?.status,
    data: err.response?.data,
    path: req.originalUrl,
    method: req.method,
  });


  // Axios errors
  if (err.response) {
    const status = err.response.status || 500;
    const data = err.response.data;
    // If Spring sent ResponseObject, try to unwrap message
    const payload = typeof data === 'object' ? data : { message: String(data) };
    return res.status(status).json({ ...payload, status });
  }


  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal Server Error', status });
}