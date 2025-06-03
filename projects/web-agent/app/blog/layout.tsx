import React, { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import { Metadata } from 'next';

// Define metadata for SEO
export const metadata: Metadata = {
  title: {
    template: '%s | brain9ai Blog',
    default: 'AI Automation Blog | brain9ai',
  },
  description: 'Explore our blog for industry insights, use cases and implementation guides on how AI agents are transforming business operations.',
  keywords: ['AI Automation', 'Voice Agents', 'AI Sales', 'Business Transformation', 'Digital Strategy', 'AI Implementation', 'blog', 'articles', 'AI agents', 'WebAgent', 'RocketSingh', 'brain9ai', 'AI technology'],
  authors: [{ name: 'brain9ai' }],
  creator: 'brain9ai',
  publisher: 'brain9ai',
  openGraph: {
    type: 'website',
    siteName: 'brain9ai Blog',
    title: 'AI Automation Blog | Industry Use Cases & Insights',
    description: 'Discover how AI agents are transforming businesses across industries with our expert insights, use cases, and implementation guides.',
    images: [
      {
        url: '/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'brain9ai Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Blog | brain9ai',
    description: 'Explore industry insights and use cases on how AI agents are transforming business operations.',
    images: ['/images/og-blog.jpg'],
    creator: '@brain9ai',
  },
  alternates: {
    canonical: 'https://brain9ai.com/blog',
  },
};

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      
      {/* Content with proper z-index context */}
      <div className="flex-1 relative z-0 w-full">
        {/* Main content */}
        {children}
      </div>
    </div>
  );
} 