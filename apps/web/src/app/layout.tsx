import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Modern e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
