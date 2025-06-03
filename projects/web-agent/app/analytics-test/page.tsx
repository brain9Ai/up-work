import { Metadata } from 'next';
import GATest from '../components/GATest';
import Navbar from '../components/Navbar';

// Metadata for the page
export const metadata: Metadata = {
  title: 'Google Analytics Test',
  description: 'Test page for verifying Google Analytics integration',
};

export default function AnalyticsTestPage() {
  return (
    <main>
      <Navbar />
      <div className="container mx-auto pt-24 pb-12">
        <GATest />
      </div>
    </main>
  );
} 