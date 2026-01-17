import type { Metadata, Viewport } from 'next';
import { Providers } from '@/lib/providers';
import { Header, Footer } from '@/shared/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'E-Commerce Store',
    template: '%s | E-Commerce Store',
  },
  description: 'Modern e-commerce platform - 최고의 쇼핑 경험을 제공합니다',
  keywords: ['쇼핑', '이커머스', '온라인 쇼핑몰'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
