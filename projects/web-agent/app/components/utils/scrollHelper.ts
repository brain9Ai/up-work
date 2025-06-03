'use client';

/**
 * Force scroll to element by ID using multiple fallback methods
 * This is needed because regular scrollIntoView doesn't always work with hash navigation
 */
export const forceScrollToSection = (sectionId: string): void => {
  console.log(`ScrollHelper: Attempting to scroll to section: ${sectionId}`);
  
  const scrollOptions = { behavior: 'smooth' as ScrollBehavior, block: 'start' as ScrollLogicalPosition };
  
  try {
    // First method: Try to use scrollIntoView
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`ScrollHelper: Found section element, using scrollIntoView`);
      
      // First attempt - use scrollIntoView directly
      element.scrollIntoView(scrollOptions);
      
      // Second attempt - setTimeout and scroll again after a small delay
      setTimeout(() => {
        element.scrollIntoView(scrollOptions);
      }, 100);
      
      // Third attempt - use window.scrollTo with element offsetTop
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top = rect.top + scrollTop;
        
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }, 200);
    } else {
      console.error(`ScrollHelper: Element with ID ${sectionId} not found`);
    }
  } catch (error) {
    console.error(`ScrollHelper: Error scrolling to section: ${error}`);
  }
};

/**
 * Helper to select industry tab by index
 */
export const selectIndustryTab = (index: number): boolean => {
  console.log(`ScrollHelper: Attempting to select industry tab ${index}`);
  
  try {
    // First approach: Using data attribute
    const buttons = document.querySelectorAll('.anaya-industry-buttons [data-industry-index]');
    if (buttons && buttons.length > 0) {
      console.log(`ScrollHelper: Found ${buttons.length} industry buttons by data attribute`);
      if (buttons[index]) {
        (buttons[index] as HTMLElement).click();
        return true;
      }
    }
    
    // Second approach: Direct array access
    const buttonContainer = document.querySelector('.anaya-industry-buttons');
    if (buttonContainer) {
      const directButtons = buttonContainer.querySelectorAll('button');
      if (directButtons && directButtons.length > 0) {
        console.log(`ScrollHelper: Found ${directButtons.length} industry buttons by direct selection`);
        if (directButtons[index]) {
          (directButtons[index] as HTMLElement).click();
          return true;
        }
      }
    }
    
    // Third approach: Try to use window-level function
    if (typeof window !== 'undefined' && (window as any).anayaSetActiveIndustry) {
      console.log(`ScrollHelper: Using window-level anayaSetActiveIndustry function`);
      return (window as any).anayaSetActiveIndustry(index);
    }
    
    // Fourth approach: Send a custom event
    const event = new CustomEvent('anaya-select-industry', { detail: { index } });
    window.dispatchEvent(event);
    console.log(`ScrollHelper: Dispatched anaya-select-industry event with index ${index}`);
    return true;
  } catch (error) {
    console.error(`ScrollHelper: Error selecting industry tab: ${error}`);
    return false;
  }
};

/**
 * Helper to select use case tab by index
 */
export const selectUseCaseTab = (index: number): boolean => {
  console.log(`ScrollHelper: Attempting to select use case tab ${index}`);
  
  try {
    // First approach: Using data attribute
    const buttons = document.querySelectorAll('.anaya-usecase-buttons [data-use-case-index]');
    if (buttons && buttons.length > 0) {
      console.log(`ScrollHelper: Found ${buttons.length} use case buttons by data attribute`);
      if (buttons[index]) {
        (buttons[index] as HTMLElement).click();
        return true;
      }
    }
    
    // Second approach: Direct array access
    const buttonContainer = document.querySelector('.anaya-usecase-buttons');
    if (buttonContainer) {
      const directButtons = buttonContainer.querySelectorAll('button');
      if (directButtons && directButtons.length > 0) {
        console.log(`ScrollHelper: Found ${directButtons.length} use case buttons by direct selection`);
        if (directButtons[index]) {
          (directButtons[index] as HTMLElement).click();
          return true;
        }
      }
    }
    
    // Third approach: Try to use window-level function
    if (typeof window !== 'undefined' && (window as any).anayaSetActiveUseCase) {
      console.log(`ScrollHelper: Using window-level anayaSetActiveUseCase function`);
      return (window as any).anayaSetActiveUseCase(index);
    }
    
    // Fourth approach: Send a custom event
    const event = new CustomEvent('anaya-select-use-case', { detail: { index } });
    window.dispatchEvent(event);
    console.log(`ScrollHelper: Dispatched anaya-select-use-case event with index ${index}`);
    return true;
  } catch (error) {
    console.error(`ScrollHelper: Error selecting use case tab: ${error}`);
    return false;
  }
};

/**
 * Register all scroll helpers as global window functions
 * This allows them to be called from outside React context
 */
export const registerScrollHelpers = (): void => {
  if (typeof window !== 'undefined') {
    (window as any).forceScrollToSection = forceScrollToSection;
    (window as any).selectIndustryTab = selectIndustryTab;
    (window as any).selectUseCaseTab = selectUseCaseTab;
    
    console.log('ScrollHelper: Registered global scroll helper functions');
  }
}; 