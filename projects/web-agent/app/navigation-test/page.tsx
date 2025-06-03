'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function NavigationTestPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the home page
    router.push('/');
  }, [router]);
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Navigation Test Page</h1>
        <p>Redirecting to home page...</p>
      </div>
    </div>
  );
} 