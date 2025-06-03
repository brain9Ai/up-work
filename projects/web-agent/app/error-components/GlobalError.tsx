'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong!</h1>
            <p className="text-gray-600 mb-6">
              A critical error has occurred. We apologize for the inconvenience.
            </p>
            <button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors w-full"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 