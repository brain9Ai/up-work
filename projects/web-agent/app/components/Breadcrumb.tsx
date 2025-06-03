import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  sticky?: boolean;
}

// Function to format slug text (convert hyphens to spaces and capitalize each word)
const formatSlugText = (text: string): string => {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Breadcrumb = ({ items, sticky = false }: BreadcrumbProps) => {
  return (
    <div className={`${sticky ? 'z-50 bg-slate-950/95 backdrop-blur-sm py-2 shadow-md border-b border-slate-800/50 w-full' : 'w-full'}`}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-5 lg:px-6">
        <nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 text-xs md:text-sm text-gray-400 ${!sticky ? 'mb-4' : 'py-0.5'}`}>
          {items.map((item, index) => {
            // Last item in the breadcrumb
            const isLastItem = index === items.length - 1;
            // Format the label if it looks like a slug and is the last item
            const displayLabel = isLastItem && item.label.includes('-') 
              ? formatSlugText(item.label)
              : item.label;
            
            return (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-1.5">/</span>}
                
                {!isLastItem && item.href ? (
                  <Link 
                    href={item.href} 
                    className="hover:text-blue-400 transition-colors"
                  >
                    {displayLabel}
                  </Link>
                ) : (
                  <span className={item.isActive ? "text-blue-400" : ""}>{displayLabel}</span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb; 