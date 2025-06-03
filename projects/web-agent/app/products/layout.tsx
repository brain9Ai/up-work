import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import { Metadata } from 'next';
import { generateMetadata as genMeta } from '../utils/openGraph';

// Define metadata for SEO
export const metadata: Metadata = genMeta({
  title: 'AI Agents & Products | brain9ai',
  description: 'Discover our specialized AI agents designed to transform your business operations.',
  canonical: '/products',
  ogConfig: {
    type: 'website',
  },
  keywords: ['AI agents', 'WebAgent', 'sales automation', 'voice agent', 'AI assistant', 'business automation', 'AI products'],
});

interface ProductsLayoutProps {
  children: ReactNode;
}

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Content with proper z-index context */}
      <div className="flex-1 relative z-0">
        {/* Main content */}
        {children}
      </div>
    </div>
  );
} 