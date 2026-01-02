// src/components/GoogleAnalytics.tsx
'use client';

import { useGoogleAnalytics } from '@/lib/analytics';

export default function GoogleAnalytics(): null {
  useGoogleAnalytics();
  return null;
}