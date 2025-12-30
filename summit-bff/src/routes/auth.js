import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import {
  COGNITO_DOMAIN,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_REDIRECT_URI,
  COGNITO_LOGOUT_REDIRECT_URI,
  COGNITO_SCOPES,
} from '../config.js';
import { logger } from '../log.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * Build the Cognito authorization URL
 */
function buildAuthorizeUrl(state, redirectUri) {
  const url = new URL('/oauth2/authorize', COGNITO_DOMAIN);
  url.searchParams.set('client_id', COGNITO_CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', redirectUri || COGNITO_REDIRECT_URI);
  url.searchParams.set('scope', COGNITO_SCOPES.join(' '));
  url.searchParams.set('state', state);
  return url.toString();
}

/**
 * Build Basic Auth header for token requests
 */
function basicAuthHeader(clientId, clientSecret) {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  return `Basic ${token}`;
}

/**
 * Set session cookies with tokens
 */
function setSessionCookies(res, tokens, secure = false) {
  const { id_token, access_token, refresh_token, expires_in } = tokens;
  const expiresAt = Date.now() + (Number(expires_in) || 3600) * 1000;

  const common = {
    httpOnly: true,
    sameSite: 'lax',
    secure, // true for HTTPS, false for localhost/testing
    path: '/',
  };

  res.cookie('idToken', id_token, { ...common });
  res.cookie('accessToken', access_token, { ...common });
  if (refresh_token) res.cookie('refreshToken', refresh_token, { ...common });
  res.cookie('expiresAt', String(expiresAt), { ...common });
}

/**
 * Login route - redirect to Cognito login
 */
router.get('/login', (req, res) => {
  const state = crypto.randomUUID();

  // Save state in cookie
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: false, // false for localhost, true in production
    sameSite: 'lax',
    path: '/',
    maxAge: 5 * 60 * 1000, // 5 minutes
  });

  // Optional: save post-login redirect
  // const returnTo = req.query.returnTo || '/';
  // res.cookie('postLoginRedirect', returnTo, {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: 'lax',
  //   path: '/',
  //   maxAge: 10 * 60 * 1000, // 10 minutes
  // });

  const redirectUri = req.query.redirect_uri || COGNITO_REDIRECT_URI;
  const authUrl = buildAuthorizeUrl(state, redirectUri);

  console.log('Redirecting to Cognito:', authUrl);
  return res.redirect(authUrl);
});


router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const stateCookie = req.cookies?.oauth_state;

    console.log('Callback reached:', { code, state, stateCookie });

    if (!code || !state || !stateCookie || state !== stateCookie) {
      return res.status(400).json({ error: 'Invalid auth state' });
    }

    const tokenUrl = new URL('/oauth2/token', COGNITO_DOMAIN).toString();
    const form = new URLSearchParams();
    form.set('grant_type', 'authorization_code');
    form.set('client_id', COGNITO_CLIENT_ID);
    form.set('code', code);
    form.set('redirect_uri', COGNITO_REDIRECT_URI);

    const resp = await axios.post(tokenUrl, form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET),
      },
      timeout: 10000,
    });

    setSessionCookies(res, resp.data, false);

    // Decode the ID token to find the user's group
    const decoded = jwt.decode(resp.data.id_token);
    const groups = (decoded?.['cognito:groups'] || []).map(g => g.toLowerCase());
    console.log('User groups:', groups);

    // Determine redirect target based on group
    const FRONTEND_URL = 'http://localhost:9090';
    let target = `${FRONTEND_URL}/`; // default (customer)

    if (groups.includes('admin')) {
      target = `${FRONTEND_URL}/admin`;
    } else if (groups.includes('supplier')) {
      target = `${FRONTEND_URL}/supplier`;
    } else if (groups.includes('customer')) {
      target = `${FRONTEND_URL}/`;
    }

    // Clear temporary cookies
    res.clearCookie('oauth_state');
    res.clearCookie('postLoginRedirect');

    console.log('Redirecting user to:', target);
    return res.redirect(target);
  } catch (err) {
    logger.error('Auth callback failed', { message: err.message, data: err.response?.data });
    return res.status(401).json({ error: 'Authentication failed' });
  }
});


/**
 * Frontend-driven code exchange (SPA)
 */
router.post('/exchange', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body || {};
    if (!code || !redirect_uri) {
      return res.status(400).json({ error: 'code and redirect_uri are required' });
    }

    const tokenUrl = new URL('/oauth2/token', COGNITO_DOMAIN).toString();
    const form = new URLSearchParams();
    form.set('grant_type', 'authorization_code');
    form.set('client_id', COGNITO_CLIENT_ID);
    form.set('code', code);
    form.set('redirect_uri', redirect_uri);

    const resp = await axios.post(tokenUrl, form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET),
      },
      timeout: 10000,
    });

    setSessionCookies(res, resp.data, false);
    return res.json(resp.data);
  } catch (err) {
    logger.error('Auth exchange failed', { message: err.message, data: err.response?.data });
    return res.status(401).json({ error: 'Authentication failed' });
  }
});

/**
 * Refresh token route
 */
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    const tokenUrl = new URL('/oauth2/token', COGNITO_DOMAIN).toString();
    const form = new URLSearchParams();
    form.set('grant_type', 'refresh_token');
    form.set('client_id', COGNITO_CLIENT_ID);
    form.set('refresh_token', refreshToken);

    const resp = await axios.post(tokenUrl, form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET),
      },
      timeout: 10000,
    });

    setSessionCookies(res, resp.data, false);
    return res.json({ ok: true });
  } catch (err) {
    logger.warn('Token refresh failed', { message: err.message, data: err.response?.data });
    return res.status(401).json({ error: 'Refresh failed' });
  }
});

/**
 * Logout route
 */
// router.get('/logout', (req, res) => {
//   console.log("LOGOUT ROUTE HIT");
//   try {
//     res.clearCookie('idToken');
//     res.clearCookie('accessToken');
//     res.clearCookie('refreshToken');
//     res.clearCookie('expiresAt');

//     const logoutUrl =
//     `https://us-east-1hxqvt19yc.auth.us-east-1.amazoncognito.com/logout` +
//     `?client_id=2k09pqej42vu0qkobejf6a3q47` +
//     `&logout_uri=${redirectUri}` +
//     `&redirect_uri=${redirectUri}`;

//   console.log("Redirecting to:", logoutUrl);

//   res.redirect(logoutUrl);

    // const url = new URL('/logout', COGNITO_DOMAIN);
    // url.searchParams.set('client_id', COGNITO_CLIENT_ID);
    // url.searchParams.set('logout_uri', COGNITO_LOGOUT_REDIRECT_URI);

    // console.log('Cognito Logout Redirect URL:', url.toString());
    // console.log('After logout, Cognito will send user to:', COGNITO_LOGOUT_REDIRECT_URI);

    // return res.redirect(url.toString());
//   } catch (err) {
//     logger.warn('Logout error', { message: err.message });
//     return res.json({ ok: true });
//   }
// });
router.get("/logout", (req, res) => {
  console.log("LOGOUT ROUTE HIT");

  const redirecturi = "http://localhost:3000/auth/login";

const logoutUrl =
  `${COGNITO_DOMAIN}/logout` +
  `?client_id=${COGNITO_CLIENT_ID}` +
  `&logout_uri=${encodeURIComponent(redirecturi)}`;


  console.log("Redirecting to:", logoutUrl);

  res.redirect(logoutUrl);
});



export default router;
