// src/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { logger } from './log.js';

import { PORT, CORS_ALLOWED_ORIGINS } from './config.js';
import productsRouter from './routes/products.js';
import approvalRouter from './routes/approval.js';
import cartRouter from './routes/cart.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { cartController } from './controllers/cartController.js';


const app = express();


/**
 * Security and performance middlewares
 */
app.use(helmet());
app.use(compression());
app.use(cookieParser());



app.use(
  cors({
    origin(origin, cb) {
      if (!origin || CORS_ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // only keep true if you actually use cookies/sessions
  })
);



/**
 * Body parsing and logging
 */
app.use(express.json());
app.use(morgan('dev'));
app.use(morgan('combined', { stream: logger.stream }));


/**
 * Health
 */
app.get('/health', (_req, res) =>
  res.json({ ok: true, service: 'ecommerce-bff', ts: new Date().toISOString() })
);


/**
 * Routes
 */
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/approval', approvalRouter);
app.use('/cart',cartRouter); // dynamic import to avoid circular dependency

/**
 * 404 and error handling
 */
app.use(notFoundHandler);
app.use(errorHandler);


/**
 * Start server
 */
app.listen(PORT,'0.0.0.0', () => {
  logger.info('[BFF] listening', { url: `http://localhost:${PORT}` });
  logger.info('[BFF] Allowed origins', { origins: CORS_ALLOWED_ORIGINS });
});




