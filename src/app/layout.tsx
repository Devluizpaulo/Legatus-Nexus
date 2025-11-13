import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Legatus Nexus',
  description: 'A gestão completa para o seu escritório de advocacia.',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// We are not using next/font for Space Grotesk to follow the instructions
// But we'll define it here for tailwindcss to pick it up.
const spaceGrotesk = {
  variable: '--font-space-grotesk',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", inter.variable, spaceGrotesk.variable)}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
