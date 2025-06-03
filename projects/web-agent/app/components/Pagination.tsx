'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show 5 page numbers max
    
    // If less than max pages, show all
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Handle larger number of pages with ellipsis
      if (currentPage <= 3) {
        // Current page is near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Current page is near the end
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Current page is in the middle
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  // Handle click on a page button
  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className={`flex items-center justify-center py-6 ${className}`} aria-label="Pagination">
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 px-4 py-2 inline-flex items-center">
        {/* Previous button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-300 ${
            currentPage === 1
              ? 'text-slate-500 cursor-not-allowed'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          aria-label="Previous page"
        >
          <span className="sr-only">Previous</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Page numbers */}
        <div className="hidden sm:flex items-center mx-2">
          {pageNumbers.map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                …
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => handlePageClick(page as number)}
                className={`w-10 h-10 mx-1 flex items-center justify-center rounded-lg transition-all duration-300 ${
                  page === currentPage
                    ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/20 transform scale-110'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        {/* Simplified mobile view */}
        <div className="sm:hidden px-3 text-sm font-medium text-slate-300">
          <span className="text-blue-400">{currentPage}</span>
          <span className="mx-1">/</span>
          <span>{totalPages}</span>
        </div>
        
        {/* Next button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-300 ${
            currentPage === totalPages
              ? 'text-slate-500 cursor-not-allowed'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          aria-label="Next page"
        >
          <span className="sr-only">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Jump to first/last page buttons - only visible on larger screens */}
      <div className="hidden lg:flex space-x-2 ml-3">
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border transition-all duration-300 ${
            currentPage === 1
              ? 'border-slate-700 text-slate-500 cursor-not-allowed'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
          }`}
          aria-label="Go to first page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border transition-all duration-300 ${
            currentPage === totalPages
              ? 'border-slate-700 text-slate-500 cursor-not-allowed'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
          }`}
          aria-label="Go to last page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Pagination; 