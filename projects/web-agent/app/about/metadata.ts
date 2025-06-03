import { Metadata } from 'next';
import { generateMetadata as genMeta } from '../utils/openGraph';

// Generate metadata for the About page
export const metadata: Metadata = genMeta({
  title: 'About brain9ai | Our Team & Mission',
  description: 'Learn about brain9ai\'s mission to transform businesses through intelligent AI agents and meet our expert team of AI automation specialists.',
  canonical: '/about',
  keywords: ['about brain9ai', 'AI team', 'AI mission', 'AI automation experts', 'brain9ai team'],
  ogConfig: {
    type: 'website',
    customImage: false
  }
}); 