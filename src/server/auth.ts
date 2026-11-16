import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

export interface AdminUserPayload {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

export interface SignedAdminTokenPayload extends AdminUserPayload {
  iat: number;
  exp: number;
  jti: string;
}

const revokedTokenJtis = new Set<string>();
const loginAttemptMap = new Map<string, { count: number; resetAt: number }>();

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const MAX_LOGIN_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function getSessionSecret(): string {
  const configured = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (configured.length >= 16 && !configured.includes('MY_ADMIN_SESSION_SECRET')) {
    return configured;
  }
  return 'sbs-vadodara-hmac-fallback-secret-key-2026-only-for-dev';
}

export function hashPassword(password: string, salt?: string): string {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, useSalt, 64).toString('hex');
  return `scrypt$${useSalt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !storedHash.startsWith('scrypt$')) return false;
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const [, salt, originalHex] = parts;
    const candidateHex = crypto.scryptSync(password, salt, 64).toString('hex');
    const a = Buffer.from(originalHex, 'hex');
    const b = Buffer.from(candidateHex, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getDefaultAdminCredentials(): {
  email: string;
  passwordPlain: string;
  name: string;
  isDefaultDevCredentials: boolean;
} {
  const envEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const envPassword = (process.env.ADMIN_PASSWORD || '').trim();
  const envName = (process.env.ADMIN_NAME || '').trim();

  const hasCustomEnv =
    Boolean(envEmail && envPassword) &&
    !envPassword.includes('CHANGE_ME') &&
    !envPassword.includes('MY_ADMIN_PASSWORD');

  return {
    email: hasCustomEnv ? envEmail : 'admin@sonusbeautystudio.com',
    passwordPlain: hasCustomEnv ? envPassword : 'SonuAdmin@2026!',
    name: envName || 'Sonu’s Studio Administrator',
    isDefaultDevCredentials: !hasCustomEnv,
  };
}

export function createAdminSessionToken(user: AdminUserPayload): {
  token: string;
  expiresAt: string;
} {
  const now = Date.now();
  const exp = now + SESSION_TTL_MS;
  const payload: SignedAdminTokenPayload = {
    ...user,
    iat: now,
    exp,
    jti: crypto.randomUUID(),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadBase64)
    .digest('base64url');

  return {
    token: `${payloadBase64}.${signature}`,
    expiresAt: new Date(exp).toISOString(),
  };
}

export function verifyAdminSessionToken(token: string | undefined | null): SignedAdminTokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length !== 2) return null;
  const [payloadBase64, providedSig] = parts;

  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadBase64)
    .digest('base64url');

  const sigBufA = Buffer.from(providedSig);
  const sigBufB = Buffer.from(expectedSig);
  if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    ) as SignedAdminTokenPayload;

    if (!parsed.exp || Date.now() > parsed.exp) {
      return null;
    }
    if (!parsed.jti || revokedTokenJtis.has(parsed.jti)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function revokeAdminSessionToken(token: string | undefined | null): boolean {
  const verified = verifyAdminSessionToken(token);
  if (!verified) return false;
  revokedTokenJtis.add(verified.jti);
  return true;
}

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = loginAttemptMap.get(identifier);
  if (!record || now > record.resetAt) {
    return { allowed: true };
  }
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }
  return { allowed: true };
}

export function recordFailedLoginAttempt(identifier: string): void {
  const now = Date.now();
  const existing = loginAttemptMap.get(identifier);
  if (!existing || now > existing.resetAt) {
    loginAttemptMap.set(identifier, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    existing.count += 1;
  }
}

export function clearLoginAttempts(identifier: string): void {
  loginAttemptMap.delete(identifier);
}

export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim();
}

export interface AuthenticatedRequest extends Request {
  adminUser?: SignedAdminTokenPayload;
}

export function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = extractBearerToken(req.headers.authorization);
  const verified = verifyAdminSessionToken(token);
  if (!verified) {
    return res.status(401).json({
      error: 'Unauthorized: Valid administrator authentication is required.',
    });
  }
  req.adminUser = verified;
  return next();
}
