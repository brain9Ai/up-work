'use client';

import { useRouter } from 'next/navigation';
import toolManager, { Tool } from '../ToolManager';
import { forceScrollToSection } from '../../utils/scrollHelper';
import { setAgentActive } from '../SessionManager';

// Create the navigation tool function
const createNavigationTool = (): Tool => {
  return {
    name: 'navigate',
    definition: {
      type: 'function',
      function: {
        name: 'navigate',
        description: 'Navigate to a different page in the application based on the sitemap provided in your instructions. Use this tool to navigate to product pages, blog articles, or sections of the website. Always use exact paths from the sitemap.',
        parameters: {
          type: 'object',
          properties: {
            route: {
              type: 'string',
              description: 'The exact route from the sitemap to navigate to. For example: "/products/anaya-webAgent", "/blog/anaya-voice-navigation-revolution", "/services", etc.'
            }
          },
          required: ['route']
        }
      }
    },
    handler: async (params: any) => {
      const { route } = params;
      const context = params.context;
      
      console.log(`NavigationTool: Navigating to ${route}`);
      
      // Store agent state before ANY navigation to maintain state across pages
      setAgentActive();
      
      // Special handling for homepage sections (these are handled directly)
      if (route.includes('#')) {
        // Parse the section ID and any query parameters
        const [baseUrl, fragment] = route.split('#');
        const sectionId = fragment.split('?')[0];
        
        console.log(`NavigationTool: Navigating to section #${sectionId}`);
        
        // Extract query parameters if they exist
        let industryParam: string | null = null;
        let useCaseParam: string | null = null;
        
        if (route.includes('?')) {
          const queryString = route.split('?')[1];
          
          // Handle both single parameter and combined parameters
          if (queryString.includes('&')) {
            // Handle multiple parameters
            const params = new URLSearchParams(queryString);
            industryParam = params.get('industry');
            useCaseParam = params.get('usecase');
          } else if (queryString.includes('industry=')) {
            // Handle just industry parameter
            industryParam = queryString.replace('industry=', '');
          } else if (queryString.includes('usecase=')) {
            // Handle just usecase parameter
            useCaseParam = queryString.replace('usecase=', '');
          }
          
          console.log(`NavigationTool: Extracted params - industry: ${industryParam}, useCase: ${useCaseParam}`);
        }
        
        setTimeout(() => {
          if (window.location.pathname === '/') {
            // Set the hash to ensure URL is updated
            window.location.hash = sectionId;
            
            // Use dedicated scroll helper
            setTimeout(() => {
              try {
                forceScrollToSection(sectionId);
                
                // Handle special case for the anaya-in-action section with industry and use case tabs
                if (sectionId === 'anaya-in-action') {
                setTimeout(() => {
                    // Function to safely set industry
                    const setIndustry = (industryValue: string | null) => {
                      if (!industryValue || typeof window === 'undefined' || !(window as any).anayaSetActiveIndustry) return false;
                  
                  let industryIndex = -1;
                      switch (industryValue) {
                        case 'ecommerce':
                    industryIndex = 0;
                          break;
                        case 'restaurant':
                    industryIndex = 1;
                          break;
                        case 'hotel':
                    industryIndex = 2;
                          break;
                        case 'blog':
                        case 'media':
                    industryIndex = 3;
                          break;
                        case 'saas':
                        case 'software':
                    industryIndex = 4;
                          break;
                      }
                      
                      if (industryIndex >= 0) {
                        console.log(`NavigationTool: Setting industry index to ${industryIndex}`);
                        (window as any).anayaSetActiveIndustry(industryIndex);
                        return true;
                      }
                      return false;
                    };
                    
                    // Function to safely set use case
                    const setUseCase = (useCaseValue: string | null) => {
                      if (!useCaseValue || typeof window === 'undefined' || !(window as any).anayaSetActiveUseCase) return false;
                      
                  let useCaseIndex = -1;
                      switch (useCaseValue) {
                        case 'search':
                    useCaseIndex = 0;
                          break;
                        case 'recommendation':
                    useCaseIndex = 1;
                          break;
                        case 'engagement':
                    useCaseIndex = 2;
                          break;
                        case 'lead':
                        case 'capture':
                    useCaseIndex = 3;
                          break;
                        case 'support':
                        case 'connection':
                    useCaseIndex = 4;
                          break;
                      }
                      
                      if (useCaseIndex >= 0) {
                        console.log(`NavigationTool: Setting use case index to ${useCaseIndex}`);
                        (window as any).anayaSetActiveUseCase(useCaseIndex);
                        return true;
                      }
                      return false;
                    };
                    
                    // First set industry
                    const industrySet = setIndustry(industryParam);
                    
                    // Then set use case with a small delay
                    setTimeout(() => {
                      setUseCase(useCaseParam);
                    }, industrySet ? 300 : 0);
                  }, 500);
                }
              } catch (err) {
                console.error('Error during section navigation:', err);
              }
            }, 100);
          } else {
            // Navigate to homepage with hash if not already on homepage
            window.location.href = route;
          }
        }, 50);
        
        // Customize the response message based on the section and parameters
        let responseMessage = `I'm taking you to the ${sectionId.replace(/-/g, ' ')} section`;
        
        if (industryParam) {
          responseMessage += ` with a focus on the ${industryParam} industry`;
        }
        
        if (useCaseParam) {
          responseMessage += `${industryParam ? ' and' : ' with'} the ${useCaseParam} use case`;
        }
        
        return { 
          success: true, 
          message: responseMessage
        };
      }
      
      // Standard navigation for all other routes
      // Is this a product navigation? Handle specially to keep navigation clean
      const isProductNavigation = route.startsWith('/products/');
      const isBlogNavigation = route.startsWith('/blog/');
      const isServiceNavigation = route.startsWith('/services');
      
            setTimeout(() => {
        // Use Next.js router if available for client-side navigation
        if (context && context.router) {
          console.log(`NavigationTool: Using Next.js router for navigation`);
              try {
            // Use router.push for client-side navigation which preserves component state
            context.router.push(route);
              } catch (err) {
            console.error('Navigation error:', err);
            // Fall back to window.location if router.push fails
            window.location.href = route;
          }
        } else {
          // Fallback to standard window.location if router is not available
          console.log(`NavigationTool: Using window.location for navigation`);
          window.location.href = route;
        }
      }, 50);
      
      // Customize message based on the type of navigation
      if (isProductNavigation) {
        const productId = route.split('/').pop();
        return { 
          success: true, 
          message: `I'm taking you to our ${productId?.replace(/-/g, ' ')} product page`
        };
      } else if (isBlogNavigation) {
        if (route === '/blog') {
          return {
            success: true,
            message: `I'm taking you to our blog page`
          };
        } else {
          const articleName = route.split('/').pop()?.replace(/-/g, ' ');
          return { 
            success: true, 
            message: `I'm taking you to the "${articleName}" article`
          };
        }
      } else if (isServiceNavigation) {
        return {
          success: true,
          message: `I'm taking you to our services page`
        };
      } else {
        return { 
          success: true, 
          message: `I'm taking you to ${route}`
        };
      }
    }
  };
};

// Create an instance of the navigation tool
const navigationTool = createNavigationTool();

// Setup hook to provide router context to the navigation tool
export const useNavigationTool = () => {
  const router = useRouter();
  
  // Set the router in the tool manager context
  toolManager.setContext({ router });
  
  // Ensure the tool is registered
  if (!toolManager.getTool('navigate')) {
    registerNavigationTool();
  }
  
  return null; // This hook doesn't render anything
};

// Export a function to register the tool when needed
export const registerNavigationTool = () => {
  // Check if the tool is already registered to avoid duplicate registration
  if (!toolManager.getTool('navigate')) {
    console.log('Registering NavigationTool');
  toolManager.registerTool(navigationTool);
  }
  return navigationTool;
};

// Export the tool without registering it at the module level
export default navigationTool;