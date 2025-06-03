import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
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