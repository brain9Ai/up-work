import { ReactNode } from 'react';
import { Metadata } from 'next';
import { generateMetadata as genMeta } from '../utils/openGraph';
import Navbar from '../components/Navbar';

interface ContactLayoutProps {
  children: ReactNode;
}

// Generate metadata for the Contact page
export const metadata: Metadata = genMeta({
  title: 'Contact Us | brain9ai',
  description: 'Get in touch with brain9ai for AI automation solutions, custom integrations, and voice agent implementations. Schedule a demo or consultation today.',
  canonical: '/contact',
  keywords: ['contact brain9ai', 'AI automation support', 'voice agent demo', 'consultation', 'AI implementation'],
  ogConfig: {
    type: 'website',
    customImage: false
  }
});

export default function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Content with padding-top to prevent navbar overlap */}
      <div className="flex-1 relative pt-24">
        {/* Main content */}
        {children}
      </div>
    </div>
  );
} 