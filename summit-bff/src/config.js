import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PRODUCT_SERVICE_URL = 'http://localhost:8080';
export const APPROVAL_SERVICE_URL = 'http://localhost:8000';
export const CART_SERVICE_URL = 'http://localhost:8001';


export const CORS_ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || '').split(',').filter(Boolean).length
  ? (process.env.CORS_ALLOWED_ORIGINS || '').split(',').map(s => s.trim())
  : [
      'http://localhost:8086',
      'http://localhost:8085',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:8083',
      'http://localhost:9090',
    ];


// AWS Cognito config for JWT verification
export const COGNITO_JWKS_URL = process.env.COGNITO_JWKS_URL || '';
export const COGNITO_ISSUER = process.env.COGNITO_ISSUER || '';
export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';
export const ROLE_CLAIMS = (process.env.ROLE_CLAIMS || 'custom:role,role,roles').split(',').map((s) => s.trim()).filter(Boolean);


// Server-side OAuth settings (using client secret)
export const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN || '';
export const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || '';
// export const COGNITO_REDIRECT_URI = process.env.COGNITO_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;
export const COGNITO_REDIRECT_URI = `http://localhost:3000/auth/callback`;
export const COGNITO_LOGOUT_REDIRECT_URI = `http://localhost:3000/auth/logout`;
export const COGNITO_SCOPES = (process.env.COGNITO_SCOPES || 'openid profile email').split(' ').filter(Boolean);





