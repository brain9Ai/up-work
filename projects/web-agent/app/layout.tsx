import './globals.css';
import { Metadata } from 'next';
import { Rajdhani, Orbitron } from 'next/font/google';
import Footer from './components/Footer';
import dynamic from 'next/dynamic';
import Config from './utils/Config';
import { Analytics } from '@vercel/analytics/react';
import { generateOpenGraph } from './utils/openGraph';

// Import ClientProvider dynamically to avoid server rendering issues
const ClientProvider = dynamic(() => import('./components/agent/ClientProvider'), { ssr: false });
const WebAgent = dynamic(() => import('./components/agent/WebAgent'), { ssr: false });
const AnalyticsInitializer = dynamic(() => import('./components/AnalyticsInitializer'), { ssr: false });

// Load the fonts
const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
});

// RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${orbitron.variable} overflow-x-hidden`}>
      <head>
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Explicit favicon links for better cross-browser compatibility */}
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon/new/brain9ai.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon/new/safari-pinned-tab.svg" color="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
      </head>
      <body className={`${rajdhani.className} overflow-x-hidden`}>
        <div className="grid-pattern"></div>
        <Analytics />
        <AnalyticsInitializer />
        <ClientProvider>
          <WebAgent>
            <div className="flex flex-col min-h-screen overflow-x-hidden">
              {children}
              <Footer />
            </div>
          </WebAgent>
        </ClientProvider>
      </body>
    </html>
  );
}

// Define essential metadata for the entire site
export const metadata = {
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://brain9ai.com'),
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32' }
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon/new/brain9ai.svg',
      },
      {
        rel: 'mask-icon',
        url: '/favicon/new/safari-pinned-tab.svg',
        color: '#3B82F6'
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}; 