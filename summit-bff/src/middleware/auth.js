// AWS Cognito JWT authentication middleware using jose
// Verifies Bearer tokens against the provided JWKS URL and attaches user to req.user
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { logger } from '../log.js';
import {
  COGNITO_JWKS_URL,
  COGNITO_ISSUER,
  COGNITO_CLIENT_ID,
  ROLE_CLAIMS,
} from '../config.js';


let jwks;
function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(COGNITO_JWKS_URL), { cache: true, cooldownDuration: 300000 }); // 5min cache
  }
  return jwks;
}


function extractRole(payload) {
  // Try claims in configured priority order
  for (const c of ROLE_CLAIMS) {
    const v = payload?.[c];
    if (!v) continue;
    if (Array.isArray(v)) return String(v[0]).toLowerCase();
    return String(v).toLowerCase();
  }
  // Cognito default groups claim
  if (Array.isArray(payload?.['cognito:groups']) && payload['cognito:groups'].length)
    return String(payload['cognito:groups'][0]).toLowerCase();
  // Fallback none
  return undefined;
}
export async function authenticate(req, res, next) {
  try {
    const auth = req.headers?.authorization || '';
    let token;
    if (auth.startsWith('Bearer ')) {
      token = auth.slice('Bearer '.length).trim();
    } else if (req.cookies?.idToken) {
      token = req.cookies.idToken; // server-set httpOnly cookie after /auth/callback
    }
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
    }


    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: COGNITO_ISSUER || undefined,
      audience: COGNITO_CLIENT_ID || undefined,
    });


    const role = extractRole(payload);


    req.user = {
      sub: payload.sub,
      username: payload['cognito:username'] || payload.username || payload.email,
      email: payload.email,
      role,
      scopes: payload.scope ? String(payload.scope).split(' ') : [],
      payload,
    };


    return next();
  } catch (err) {
    logger.warn('Auth failed', { message: err.message });
    return res.status(401).json({ error: 'Unauthorized' });
  }
}


export function requireRole(allowedRoles = []) {
  const set = new Set(allowedRoles.map((r) => String(r).toLowerCase()));

  return function (req, res, next) {
    const role = req.user?.role?.toLowerCase();
    if (!role) {
      return res.status(403).json({ error: 'Forbidden - No role found' });
    }
    if (role === 'admin') {
      return next();
    }
    if (role === 'supplier' && (set.has('supplier') || set.has('customer'))) {
      return next();
    }
    if (!set.size || set.has(role)) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
}
