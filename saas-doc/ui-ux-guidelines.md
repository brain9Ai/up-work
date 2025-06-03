# UI/UX Guidelines

This document outlines the UI/UX guidelines for the Brain9 AI Agent Platform, based on the design of the current website. Following these guidelines will ensure a consistent look and feel across the platform.

## Design System

### Color Palette

Extract the following colors from the current site:

```css
:root {
  /* Primary Colors */
  --primary: #4f46e5; /* Indigo */
  --primary-dark: #4338ca;
  --primary-light: #818cf8;
  
  /* Secondary Colors */
  --secondary: #10b981; /* Emerald */
  --secondary-dark: #059669;
  --secondary-light: #34d399;
  
  /* Neutrals */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
  
  /* Semantic Colors */
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  
  /* Background */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  
  /* Text */
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-tertiary: #64748b;
  --text-on-primary: #ffffff;
  
  /* Border */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;
  --border-dark: #94a3b8;
}
```

### Typography

```css
/* Font Families */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
--font-mono: 'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace;
--font-display: 'Outfit', var(--font-sans);

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Font Weights */
--font-thin: 100;
--font-extralight: 200;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Spacing

```css
/* Spacing */
--space-0: 0;
--space-0.5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1.5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2.5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3.5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
```

### Shadows

```css
/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Border Radius

```css
/* Border Radius */
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius: 0.25rem;       /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Full rounded */
```

## Component Library

The following components should be created to match the current site's design:

### Buttons

```jsx
// Primary Button
<button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors">
  Primary Button
</button>

// Secondary Button
<button className="bg-white border border-primary text-primary hover:bg-primary-light/10 font-medium py-2 px-4 rounded transition-colors">
  Secondary Button
</button>

// Tertiary Button
<button className="text-primary hover:underline font-medium transition-colors">
  Tertiary Button
</button>

// Disabled Button
<button className="bg-neutral-200 text-neutral-500 font-medium py-2 px-4 rounded cursor-not-allowed" disabled>
  Disabled Button
</button>
```

### Cards

```jsx
// Basic Card
<div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-neutral-600">Card content goes here.</p>
</div>

// Agent Card
<div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
  <div className="h-40 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
    <img src="/agent-icon.svg" alt="Agent Icon" className="h-16 w-16" />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-1">Agent Name</h3>
    <p className="text-neutral-600 mb-4 line-clamp-2">Agent description goes here with a brief overview of its capabilities.</p>
    <div className="flex justify-between items-center">
      <span className="text-primary font-medium">₹199/month</span>
      <button className="bg-primary hover:bg-primary-dark text-white font-medium py-1.5 px-3 rounded-md text-sm transition-colors">
        Subscribe
      </button>
    </div>
  </div>
</div>
```

### Form Elements

```jsx
// Text Input
<div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
  <input 
    type="email" 
    id="email" 
    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
    placeholder="you@example.com"
  />
</div>

// Select Input
<div className="mb-4">
  <label htmlFor="plan" className="block text-sm font-medium text-neutral-700 mb-1">Subscription Plan</label>
  <select 
    id="plan" 
    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
  >
    <option>Monthly</option>
    <option>Yearly</option>
  </select>
</div>

// Checkbox
<div className="flex items-center mb-4">
  <input 
    type="checkbox" 
    id="terms" 
    className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
  />
  <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
    I agree to the terms and conditions
  </label>
</div>
```

### Navigation

```jsx
// Main Navigation
<nav className="bg-white shadow">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      <div className="flex">
        <div className="flex-shrink-0 flex items-center">
          <img className="h-8 w-auto" src="/logo.svg" alt="Brain9 AI" />
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a href="#" className="border-primary text-neutral-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Dashboard
          </a>
          <a href="#" className="border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Marketplace
          </a>
          <a href="#" className="border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Documentation
          </a>
        </div>
      </div>
      <div className="flex items-center">
        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">
          Sign In
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Dashboard Sidebar

```jsx
// Dashboard Sidebar
<aside className="w-64 bg-white shadow-sm h-screen">
  <div className="py-6 px-4">
    <img className="h-8 w-auto" src="/logo.svg" alt="Brain9 AI" />
  </div>
  <nav className="mt-2">
    <a href="#" className="bg-primary/10 text-primary border-r-4 border-primary flex items-center px-4 py-3">
      <svg className="h-5 w-5 mr-3" /* svg content */></svg>
      Dashboard
    </a>
    <a href="#" className="text-neutral-600 hover:bg-neutral-100 flex items-center px-4 py-3">
      <svg className="h-5 w-5 mr-3" /* svg content */></svg>
      My Agents
    </a>
    <a href="#" className="text-neutral-600 hover:bg-neutral-100 flex items-center px-4 py-3">
      <svg className="h-5 w-5 mr-3" /* svg content */></svg>
      API Keys
    </a>
    <a href="#" className="text-neutral-600 hover:bg-neutral-100 flex items-center px-4 py-3">
      <svg className="h-5 w-5 mr-3" /* svg content */></svg>
      Usage
    </a>
    <a href="#" className="text-neutral-600 hover:bg-neutral-100 flex items-center px-4 py-3">
      <svg className="h-5 w-5 mr-3" /* svg content */></svg>
      Settings
    </a>
  </nav>
</aside>
```

### Alerts and Notifications

```jsx
// Success Alert
<div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-green-400" /* svg content */></svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-green-700">
        Your subscription was successful.
      </p>
    </div>
  </div>
</div>

// Error Alert
<div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-red-400" /* svg content */></svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-red-700">
        There was an error processing your request.
      </p>
    </div>
  </div>
</div>
```

### Tables

```jsx
// Data Table
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-neutral-200">
    <thead className="bg-neutral-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Name
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Status
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Usage
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-neutral-200">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img className="h-10 w-10 rounded-full" src="/agent-icon.svg" alt="" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-900">Anaya Web Agent</div>
              <div className="text-sm text-neutral-500">Web browsing assistant</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
          230 / 1000 calls
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <a href="#" className="text-primary hover:text-primary-dark">Configure</a>
          <a href="#" className="ml-4 text-neutral-600 hover:text-neutral-900">View Logs</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Page Layouts

#### Dashboard Layout

```jsx
<div className="min-h-screen bg-neutral-50">
  <div className="flex">
    {/* Sidebar */}
    <aside className="w-64 bg-white shadow-sm h-screen fixed">
      {/* Sidebar content */}
    </aside>
    
    {/* Main content */}
    <div className="ml-64 flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Dashboard</h1>
        
        {/* Content goes here */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Cards */}
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Marketplace Layout

```jsx
<div className="min-h-screen bg-neutral-50">
  {/* Navigation */}
  <nav className="bg-white shadow">
    {/* Navigation content */}
  </nav>
  
  {/* Hero section */}
  <div className="bg-white">
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          AI Agent Marketplace
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-500">
          Discover and subscribe to powerful AI agents that automate your tasks.
        </p>
      </div>
    </div>
  </div>
  
  {/* Filters */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white p-4 shadow rounded-lg">
      {/* Filter options */}
    </div>
  </div>
  
  {/* Agent grid */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Agent cards */}
    </div>
  </div>
</div>
```

## Responsive Design

The platform should be responsive with the following breakpoints:

```css
/* Breakpoints */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

Implement responsive designs for:

1. **Mobile-first approach**: Design for mobile devices first, then enhance for larger screens
2. **Collapsible sidebar**: On smaller screens, make the dashboard sidebar collapsible
3. **Responsive grids**: Use grid layouts that adapt to screen size
4. **Font sizing**: Adjust typography to be readable on all devices

## Animations and Transitions

Use subtle animations and transitions to enhance the user experience:

```css
/* Transitions */
--transition-base: all 0.2s ease-in-out;
--transition-slow: all 0.3s ease-in-out;
--transition-fast: all 0.1s ease-in-out;
```

Apply to:

1. Button hover states
2. Navigation interactions
3. Modal/dialog openings
4. Form feedback
5. Page transitions

## Accessibility Guidelines

Ensure the platform is accessible to all users:

1. **Color contrast**: Maintain a minimum contrast ratio of 4.5:1
2. **Keyboard navigation**: All interactive elements should be accessible via keyboard
3. **Screen readers**: Use appropriate ARIA attributes
4. **Focus states**: Clearly visible focus indicators
5. **Text alternatives**: Alt text for images and icons

## Implementation Notes

When implementing the UI, follow these guidelines:

1. Use Tailwind CSS for styling, matching the current site configuration
2. Create reusable components that follow these design guidelines
3. Extract design tokens from the current site for consistency
4. Use responsive design patterns that adapt to different screen sizes
5. Prioritize performance by minimizing CSS bundle size

By following these guidelines, the new platform will maintain visual consistency with the current site while providing an enhanced user experience for the agent marketplace. 