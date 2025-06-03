import { Metadata } from 'next';
import { generateMetadata as genMeta } from './utils/openGraph';

// Generate metadata for the Home page
export const metadata: Metadata = genMeta({
  title: 'brain9ai - Intelligent Agent Solutions',
  description: 'Explore our specialized AI agent ecosystem for business innovation including Anaya WebAgent, RocketSingh Sales Agent, and more intelligent automation tools.',
  canonical: '/',
  keywords: ['AI agents', 'WebAgent', 'sales automation', 'voice agent', 'AI assistant', 'business automation'],
  ogConfig: {
    type: 'website',
    customImage: false
  }
}); 