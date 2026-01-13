import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Providers } from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Winhive - Job Placement Support for Graduate Freshers',
  description: 'Premium job placement support platform for graduate freshers. Connect with top companies, track career progress, and access exclusive opportunities.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          {children}
        </Providers>
</body>
    </html>
  );
}