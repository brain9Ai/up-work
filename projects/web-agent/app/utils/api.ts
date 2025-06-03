/**
 * API utility functions for consistent API calls across the application
 */

/**
 * Base configuration for API calls
 */
export const API_CONFIG = {
  // Internal API base URL (relative to the app)
  internalBaseUrl: '/api',
  
  // External API endpoints
  externalEndpoints: {
    n8n: 'https://brain9.app.n8n.cloud/webhook'
  },
  
  // Endpoint paths
  endpoints: {
    // Internal endpoints
    storeCustomerInfo: '/store-customer-info',
    bookAppointment: '/book-appointment',
    
    // External endpoints
    n8nBookAppointment: '/book-appointment-and-store-customer-info'
  },
  
  // Field mapping for standardization
  fieldMappings: {
    // Form field name to API field name
    name: 'customerName',
    email: 'customerEmail',
    phone: 'customerPhone',
    company: 'customerCompany',
    // Handle messages and notes
    message: 'message',
    notes: 'notes'
  }
};

/**
 * Construct an internal API URL
 */
export const getInternalApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.internalBaseUrl}${endpoint}`;
};

/**
 * Construct an external API URL
 */
export const getExternalApiUrl = (service: keyof typeof API_CONFIG.externalEndpoints, endpoint: string): string => {
  return `${API_CONFIG.externalEndpoints[service]}${endpoint}`;
};

/**
 * Transform form data to standardized API fields
 */
export const transformFormData = (data: Record<string, any>): Record<string, any> => {
  const transformedData: Record<string, any> = { ...data };
  
  // Apply field mappings
  Object.entries(API_CONFIG.fieldMappings).forEach(([formField, apiField]) => {
    if (data[formField] !== undefined) {
      transformedData[apiField as string] = data[formField];
      // Remove the original field to avoid duplication
      delete transformedData[formField];
    }
  });
  
  // Ensure timestamp is present
  if (!transformedData.timestamp) {
    transformedData.timestamp = new Date().toISOString();
  }
  
  // Ensure sessionId is present
  if (!transformedData.sessionId) {
    // Generate a session ID using timestamp and random values
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    transformedData.sessionId = `${timestamp}${randomPart}`;
  }
  
  // Ensure toolName is present
  if (!transformedData.toolName) {
    // Determine toolName based on the request type
    if (transformedData.requestType === 'agent') {
      transformedData.toolName = 'store-customer-info';
    } else if (transformedData.requestType === 'service' || transformedData.requestType === 'product') {
      transformedData.toolName = 'store-customer-info';
    } else if (transformedData.requestType === 'contact') {
      transformedData.toolName = 'store-customer-info';
    } else if (transformedData.notes?.includes('Appointment')) {
      transformedData.toolName = 'book-appointment';
    } else {
      transformedData.toolName = 'store-customer-info';
    }
  }
  
  // Ensure all requests have a requestType if not already present
  if (!transformedData.requestType) {
    if (transformedData.toolName === 'book-appointment') {
      transformedData.requestType = 'appointment';
    } else if (transformedData.interest === 'service' || transformedData.serviceId) {
      transformedData.requestType = 'service';
    } else if (transformedData.agentId || transformedData.agentName) {
      transformedData.requestType = 'product';
    } else {
      transformedData.requestType = 'contact';
    }
  }
  
  return transformedData;
};

/**
 * Generic fetch API wrapper with error handling
 */
export const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * API response interface
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

/**
 * Send customer information to internal API endpoint and forward to n8n
 */
export const submitCustomerInfo = async (data: Record<string, any>): Promise<ApiResponse> => {
  try {
    // Use n8n webhook endpoint directly for customer info
    const url = getExternalApiUrl('n8n', API_CONFIG.endpoints.n8nBookAppointment);
    
    // Transform the data to use standardized field names
    const transformedData = transformFormData(data);
    
    const response = await fetchApi<ApiResponse>(url, {
      method: 'POST',
      body: JSON.stringify(transformedData)
    });
    
    return response;
  } catch (error) {
    console.error('Error in submitCustomerInfo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Book appointment through internal API endpoint
 */
export const bookAppointment = async (data: Record<string, any>): Promise<ApiResponse> => {
  try {
    const url = getInternalApiUrl(API_CONFIG.endpoints.bookAppointment);
    
    // Transform the data to use standardized field names
    const transformedData = transformFormData(data);
    
    const response = await fetchApi<ApiResponse>(url, {
      method: 'POST',
      body: JSON.stringify(transformedData)
    });
    
    return response;
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}; 