const express      = require('express');
const cors         = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');
const debugRoutes   = require('./routes/debugRoutes');  //cache inspection
const errorHandler  = require('./middleware/errorHandler');


const app = express();


//   cors({ origin: 'https://localhost:5173' })
app.use(cors());


// The limit '10kb' prevents a client from sending a gigantic payload to
app.use(express.json({ limit: '10kb' }));

//Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Feature routes 
app.use('/api', weatherRoutes);
app.use('/api/debug', debugRoutes);

// 404 Not Found handler 
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);  
});

//Global error handler
app.use(errorHandler);

module.exports = app;
