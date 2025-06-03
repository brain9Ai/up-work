'use client';

import NavigationTool from './NavigationTool';
import CustomerInfoTool from './CustomerInfoTool';
import AppointmentTool from './AppointmentTool';
import ContactTool from './ContactTool';
import ProductsTool from './ProductsTool';
import ServicesTool from './ServicesTool';
import BookAppointmentTool from './BookAppointmentTool';
import TransferCallTool from './TransferCallTool';

// Export all individual tools
export { 
  NavigationTool,
  CustomerInfoTool, 
  AppointmentTool,
  ContactTool,
  ProductsTool,
  ServicesTool,
  BookAppointmentTool,
  TransferCallTool
};

// Create a central function to get all tools for the assistant
export const getAssistantTools = () => {
  return [
    NavigationTool.definition,
    CustomerInfoTool.definition,
    AppointmentTool.definition,
    ContactTool.definition,
    ProductsTool.definition,
    ServicesTool.definition,
    BookAppointmentTool.definition,
    TransferCallTool.definition
  ];
};

// Create a central function to handle tool calls
export const handleToolCall = (functionCall: any, context: any) => {
  console.log('Function call received:', functionCall);
  
  try {
    // Extract function name and arguments
    const fnName = functionCall.name || functionCall.function?.name;
    const argumentsRaw = functionCall.arguments || functionCall.function?.arguments;
    
    // Parse arguments
    let args;
    if (typeof argumentsRaw === 'string') {
      try {
        args = JSON.parse(argumentsRaw);
      } catch (parseError) {
        console.error('Error parsing function arguments string:', parseError);
        args = null;
      }
    } else if (typeof argumentsRaw === 'object' && argumentsRaw !== null) {
      args = argumentsRaw;
    } else {
      console.error('Invalid arguments format:', argumentsRaw);
      args = null;
    }

    // Route to appropriate handler based on function name
    switch (fnName) {
      case 'navigate':
        // Handle navigation via NavigationTool to maintain agent state
        if (args?.route) {
          return NavigationTool.handler({ route: args.route, context });
        } else {
          console.error('Navigation tool called without route parameter');
          return { 
            success: false, 
            message: 'Navigation failed: No route specified'
          };
        }
      case 'store_customer_info':
        return CustomerInfoTool.handler(args, context);
      case 'schedule_appointment':
        return AppointmentTool.handler(args, context);
      case 'book_appointment_n8n':
        return BookAppointmentTool.handler(args, context);
      case 'transfer_call':
        return TransferCallTool.handler(args, context);
      case 'contact':
        return ContactTool.handler(args);
      case 'get_products':
        return ProductsTool.handler(args, context);
      case 'get_services':
        return ServicesTool.handler(args, context);
      default:
        console.warn(`Unknown function call: ${fnName}`);
        return null;
    }
  } catch (error) {
    console.error('Error handling function call:', error);
    return null;
  }
}; 
 
 