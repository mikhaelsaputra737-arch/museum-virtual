import { NextRequest, NextResponse } from 'next/server';
import {
  checkCuratorPassword,
  clearCuratorSession,
  hasCuratorSession,
  isCuratorAuthConfigured,
  isSameOriginRequest,
  setCuratorSession,
} from '@/lib/curator-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    enabled: isCuratorAuthConfigured(),
    authenticated: hasCuratorSession(request),
  });
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Permintaan lintas situs ditolak.' }, { status: 403 });
  }

  if (!isCuratorAuthConfigured()) {
    return NextResponse.json(
      { error: 'Akses kurator belum dikonfigurasi di server.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }

  const password =
    body && typeof body === 'object' && 'password' in body && typeof body.password === 'string'
      ? body.password
      : '';
  if (!password || !checkCuratorPassword(password)) {
    return NextResponse.json({ error: 'Kata sandi kurator salah.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  setCuratorSession(response);
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Permintaan lintas situs ditolak.' }, { status: 403 });
  }

  const response = NextResponse.json({ authenticated: false });
  clearCuratorSession(response);
  return response;
}
