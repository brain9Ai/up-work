'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ClientLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

const ClientLink = ({ href, className, children }: ClientLinkProps) => {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      prefetch={false}
    >
      {children}
    </Link>
  );
};

export default ClientLink; 