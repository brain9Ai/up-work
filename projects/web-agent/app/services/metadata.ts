import { Metadata } from 'next';
import { generateMetadata as genMeta } from '../utils/openGraph';

// Generate metadata for the Services page
export const metadata: Metadata = genMeta({
  title: 'AI Automation Services | brain9ai',
  description: 'Discover our professional AI automation services including workflow automation, CRM integration, and custom lead generation solutions.',
  canonical: '/services',
  keywords: ['AI automation services', 'workflow automation', 'CRM integration', 'lead generation', 'data automation', 'voice automation'],
  ogConfig: {
    type: 'website',
    customImage: false
  }
}); 