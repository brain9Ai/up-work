'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-md font-medium transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 