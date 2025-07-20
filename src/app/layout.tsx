import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { StructuredData } from '@/components/structured-data';
import ErrorBoundary from '@/components/error-boundary';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#3b82f6' }
  ],
};

export const metadata: Metadata = {
  title: 'Mindful Track - Mental Health Toolkit',
  description: 'Evidence-based tools to help you stay grounded and manage stress through breathing exercises, journaling, and mindfulness techniques.',
  keywords: ['mental health', 'wellness', 'mood tracking', 'journaling', 'mindfulness', 'self-awareness', 'breathing exercises', 'grounding', 'PWA'],
  authors: [{ name: 'Mindful Track Team' }],
  creator: 'Mindful Track',
  publisher: 'Mindful Track',
  applicationName: 'Mindful',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_PATH ? `https://fezbot3000.github.io${process.env.NEXT_PUBLIC_BASE_PATH}` : 'https://mindful-track.app'),
  alternates: {
    canonical: '/',
  },
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/manifest.json`,
  // Essential iOS PWA meta tags
  appleWebApp: {
    capable: true,
    title: 'Mindful',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'Mindful Track - Mental Health Toolkit',
    description: 'Evidence-based tools to help you stay grounded and manage stress through breathing exercises, journaling, and mindfulness techniques.',
    url: 'https://mindful-track.app',
    siteName: 'Mindful Track',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'Mindful Track App Icon',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindful Track - Mental Health Toolkit',
    description: 'Evidence-based tools to help you stay grounded and manage stress.',
    images: ['/logo.svg'],
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
        {/* Font Preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Basic PWA Meta Tags */}
        <meta name="background-color" content="#0a0a0a" />
        
        {/* iOS-Specific PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mindful" />
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* Mobile Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-title" content="Mindful" />
        
        {/* PWA Icons - MUST be PNG for iOS to recognize as PWA */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Standard Icons */}
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="shortcut icon" href="/logo.svg" />
        
        {/* Manifest */}
        <link rel="manifest" href={(process.env.NEXT_PUBLIC_BASE_PATH || '') + '/manifest.json'} />
        

        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Service Worker Registration for PWA (Production only)
            if ('serviceWorker' in navigator && '${process.env.NODE_ENV}' === 'production') {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('[PWA] Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', function() {
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            console.log('[PWA] New version available');
                            if (confirm('A new version is available. Reload to update?')) {
                              window.location.reload();
                            }
                          }
                        });
                      }
                    });
                  })
                  .catch(function(error) {
                    console.log('[PWA] Service Worker registration failed:', error);
                  });
              });
            } else if ('${process.env.NODE_ENV}' === 'development') {
              // Unregister any existing service workers in development
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                    console.log('[DEV] Service Worker unregistered:', registration.scope);
                  }
                });
              }
            }
            
            // GitHub Pages SPA redirect handling
            (function(l) {
              if (l.search[1] === '/' ) {
                var decoded = l.search.slice(1).split('&').map(function(s) { 
                  return s.replace(/~and~/g, '&')
                }).join('?');
                window.history.replaceState(null, null,
                    l.pathname.slice(0, -1) + decoded + l.hash
                );
              }
            }(window.location))
          `
        }} />
      </head>
      <body className="font-body antialiased">
        {/* iOS PWA Status Bar Fix */}
        <div className="pwa-status-bar-fix"></div>
        
        <StructuredData />
        <ErrorBoundary>
          <ThemeProvider>
              {children}
              <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
