// lib/middleware/requestLogger.js
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function requestLogger(req) {
  Sentry.addBreadcrumb({
    category: 'http',
    message: `HTTP ${req.method} ${req.nextUrl.pathname}`,
    level: Sentry.Severity.Info,
    data: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers.get('user-agent'),
    },
  });

  return NextResponse.next();
}