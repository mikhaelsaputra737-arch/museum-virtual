import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export const CURATOR_COOKIE = 'museum_curator_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getCredentials() {
  const password = process.env.CURATOR_PASSWORD;
  const secret = process.env.CURATOR_SESSION_SECRET;

  if (!password || password.length < 16 || !secret || secret.length < 32) {
    return null;
  }

  return { password, secret };
}

export function isCuratorAuthConfigured() {
  return getCredentials() !== null;
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0].trim();
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
  const expectedOrigin =
    forwardedHost && forwardedProto
      ? `${forwardedProto}://${forwardedHost}`
      : request.nextUrl.origin;

  return origin === expectedOrigin;
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function hasCuratorSession(request: NextRequest) {
  const credentials = getCredentials();
  const token = request.cookies.get(CURATOR_COOKIE)?.value;
  if (!credentials || !token) return false;

  const [expiresAt, nonce, signature, ...rest] = token.split('.');
  if (!expiresAt || !nonce || !signature || rest.length > 0) return false;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;

  const payload = `${expiresAt}.${nonce}`;
  const expected = Buffer.from(sign(payload, credentials.secret));
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function requireCurator(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Permintaan lintas situs ditolak.' }, { status: 403 });
  }

  if (!isCuratorAuthConfigured()) {
    return NextResponse.json(
      { error: 'Akses kurator belum dikonfigurasi di server.' },
      { status: 503 },
    );
  }

  if (!hasCuratorSession(request)) {
    return NextResponse.json({ error: 'Silakan masuk sebagai kurator.' }, { status: 401 });
  }

  return null;
}

export function checkCuratorPassword(password: string) {
  const credentials = getCredentials();
  if (!credentials || password.length > 256) return false;

  const expected = createHmac('sha256', credentials.secret).update(credentials.password).digest();
  const actual = createHmac('sha256', credentials.secret).update(password).digest();
  return timingSafeEqual(actual, expected);
}

export function setCuratorSession(response: NextResponse) {
  const credentials = getCredentials();
  if (!credentials) return;

  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${expiresAt}.${randomBytes(16).toString('hex')}`;
  response.cookies.set(CURATOR_COOKIE, `${payload}.${sign(payload, credentials.secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearCuratorSession(response: NextResponse) {
  response.cookies.set(CURATOR_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
