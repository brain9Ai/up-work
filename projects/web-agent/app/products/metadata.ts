import { Metadata } from 'next';
import { generateMetadata as genMeta } from '../utils/openGraph';

// Generate metadata for the Products page
export const metadata: Metadata = genMeta({
  title: 'AI Agents & Products | brain9ai',
  description: 'Discover our specialized AI agents designed to transform your business operations.',
  canonical: '/products',
  keywords: ['AI agents', 'WebAgent', 'sales automation', 'voice agent', 'AI assistant', 'business automation', 'AI products'],
  ogConfig: {
    type: 'website',
    customImage: false
  }
}); 