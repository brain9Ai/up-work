'use client';

import { Tool } from '../ToolManager';

// Define the numbers for transfer
const SUPPORT_NUMBER = '+19714022481';  // Inbound number
const SALES_NUMBER = '+919821120065';   // Fallback number

const TransferCallTool: Tool = {
  name: 'transfer_call',
  definition: {
    // According to VAPI docs, this should be type "function" for dynamic assistants
    type: "function", 
    function: {
      name: "transfer_call",
      description: "Transfer the current call to a different department or person",
      parameters: {
        type: "object",
        properties: {
          department: {
            type: "string",
            description: "The department to transfer to (e.g., 'sales', 'support', 'billing')"
          },
          reason: {
            type: "string",
            description: "The reason for the transfer"
          },
          // Add phone parameter for explicit number transfers
          phone: {
            type: "string",
            description: "The phone number to transfer to in E.164 format (e.g., +1XXXXXXXXXX)"
          }
        },
        required: ["department"]
      }
    }
  },
  handler: async (params: any) => {
    console.log('Transfer call requested:', params);
    
    try {
      // Map department to phone number
      let transferNumber = SUPPORT_NUMBER; // Default to support
      
      if (params.phone) {
        // Use explicit phone number if provided
        transferNumber = params.phone;
        console.log(`Using explicitly provided phone number: ${transferNumber}`);
      } else if (params.department?.toLowerCase().includes('sales')) {
        transferNumber = SALES_NUMBER;
      }
      
      console.log(`Transferring to ${params.department} at number ${transferNumber}`);
      
      // When using dynamic assistants, we might need to provide more info
      // to the UI or to handle transfer differently
      return {
        success: true,
        message: `Call transfer initiated to ${params.department}${params.reason ? ' for ' + params.reason : ''}`,
        transferTo: transferNumber,
        departmentName: params.department,
        reason: params.reason || 'General inquiry'
      };
    } catch (error) {
      console.error('Error transferring call:', error);
      return {
        success: false,
        message: `Failed to transfer call: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
};

export default TransferCallTool; 