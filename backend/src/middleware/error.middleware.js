const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ 
      error: 'Data dengan nilai ini sudah ada.',
      field: err.meta?.target 
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Data tidak ditemukan.' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token tidak valid.' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token kedaluwarsa.' });
  }

  // Validation errors
  if (err.type === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Terjadi kesalahan pada server.';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
