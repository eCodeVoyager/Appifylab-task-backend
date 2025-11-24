require('dotenv').config();
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

const app = express();

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 1000 : 20000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const allowedOrigins = process.env.FRONTEND_URL_CORS?.split(',').map(origin => origin.trim()) || [
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

const allMiddlewares = [
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'),
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  }),
  limiter,
  hpp(),
  mongoSanitize(),
  cookieParser(),
  express.json({ limit: '1mb' }),
  express.urlencoded({ extended: true, limit: '1mb' }),
];

app.use(allMiddlewares);

app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to Buddy Script API',
    status: 'Success',
    server_status: 'Running',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
