import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { StructuredData } from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Mindful Track - Mental Health & Wellness Tracker',
  description: 'A personal tool to track thoughts, build self-awareness, and improve mental wellness through journaling, mood tracking, and mindfulness exercises.',
  keywords: ['mental health', 'wellness', 'mood tracking', 'journaling', 'mindfulness', 'self-awareness'],
  authors: [{ name: 'Mindful Track Team' }],
  creator: 'Mindful Track',
  publisher: 'Mindful Track',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mindful-track.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mindful Track - Mental Health & Wellness Tracker',
    description: 'A personal tool to track thoughts, build self-awareness, and improve mental wellness through journaling, mood tracking, and mindfulness exercises.',
    url: 'https://mindful-track.app',
    siteName: 'Mindful Track',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindful Track - Mental Health & Wellness Tracker',
    description: 'A personal tool to track thoughts, build self-awareness, and improve mental wellness.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#64B5F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mindful Track" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased">
        <StructuredData />
        <ThemeProvider>
            {children}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
