'use client';

import CustomerInfoTool from './tools/CustomerInfoTool';
import AppointmentTool from './tools/AppointmentTool';
import ProductsTool from './tools/ProductsTool';
import ServicesTool from './tools/ServicesTool';
import NavigationTool from './tools/NavigationTool';
import ContactTool from './tools/ContactTool';
import TransferCallTool from './tools/TransferCallTool';
import SendTextTool from './tools/SendTextTool';
import BookAppointmentTool, { customerInfoStore } from './tools/BookAppointmentTool';
import { WebAgentStatus } from './WebAgent';
import { SiteData, WebAgentInfo } from './interfaces/SiteDataInterface';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import Config from '../../utils/Config';
import { siteData } from '../../data/siteData';

// Re-export types for use in tools
export type SiteDataType = SiteData;
export type WebAgentInfoType = WebAgentInfo;

// Define types for VAPI related interfaces
export type ToolDefinitionAPI = any;
export type ToolCallPayload = any;

export type Tool = {
  name: string;
  definition: any;
  description?: string;
  parameters?: any;
  response?: any;
  messages?: any[];
  handler: (args: any, context?: ToolContext) => Promise<any>;
};

// Context provided to tools when they are executed
export interface ToolContext {
  router?: any;
  siteData?: SiteDataType;
  webAgentInfo?: WebAgentInfoType;
  navigation?: Record<string, string>;
  customerInfo?: typeof customerInfoStore;
  currentPage?: string;
  status?: WebAgentStatus;
  isHomePage?: boolean;
}

/**
 * ToolManager class for registering and handling tool calls
 */
class ToolManager {
  private tools: Map<string, Tool> = new Map();
  private context: ToolContext = {};
  private lastToolCall: { name: string; timestamp: number } | null = null;

  constructor() {
    // Register default tools
    this.registerDefaultTools();
    
    // Initialize customer info in context
    this.context.customerInfo = customerInfoStore;
  }

  /**
   * Register a tool
   */
  registerTool(tool: Tool) {
    this.tools.set(tool.name, tool);
    console.log(`Registered tool: ${tool.name}`);
  }

  /**
   * Register multiple tools
   */
  registerTools(tools: Tool[]) {
    tools.forEach(tool => this.registerTool(tool));
  }

  /**
   * Get a tool by name
   */
  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get all tool definitions for assistant
   */
  getAllToolDefinitions(): any[] {
    return this.getAllTools().map(tool => tool.definition);
  }
  
  /**
   * Get tool definitions - alias for getAllToolDefinitions
   * This is to maintain compatibility with DynamicAgent.tsx
   */
  getToolDefinitions(): any[] {
    return this.getAllToolDefinitions();
  }

  /**
   * Set context for tools
   */
  setContext(context: ToolContext) {
    this.context = { 
      ...this.context, 
      ...context, 
      customerInfo: customerInfoStore,
      currentPage: context.currentPage || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    };
    
    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('ToolManager context updated:', this.context);
    }
  }

  /**
   * Handle a tool call
   */
  async handleToolCall(toolCall: { name: string; arguments: any }) {
    const { name, arguments: args } = toolCall;
    
    console.log(`Handling tool call: ${name}`, args);
    
    // Record this tool call
    this.lastToolCall = {
      name,
      timestamp: Date.now()
    };
    
    const tool = this.getTool(name);
    
    if (!tool) {
      console.error(`Tool not found: ${name}`);
      return { success: false, message: `Tool not found: ${name}` };
    }
    
    try {
      // Add context to args to ensure tools have access to it
      const argsWithContext = { ...args, context: this.context };
      const result = await tool.handler(argsWithContext, this.context);
      console.log(`Tool ${name} result:`, result);
      
      // Special handling for book_appointment_n8n - we want to automatically save customer info
      if (name === 'book_appointment_n8n' && result.success) {
        await this.ensureCustomerInfoStored(args);
      }
      
      return result;
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      return { 
        success: false, 
        message: `Error executing tool: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
  
  /**
   * Ensure customer info is stored when booking appointments
   */
  private async ensureCustomerInfoStored(args: any) {
    // Only proceed if we haven't recently called store_customer_info
    const now = Date.now();
    if (
      this.lastToolCall && 
      this.lastToolCall.name === 'store_customer_info' && 
      now - this.lastToolCall.timestamp < 10000 // within last 10 seconds
    ) {
      console.log('Customer info already stored recently, skipping auto-store');
      return;
    }
    
    try {
      // Extract relevant customer info from appointment args
      const customerInfo = {
        name: args.name,
        email: args.email,
        phone: args.phone,
        notes: args.notes
      };
      
      // Only proceed if we have at least a name
      if (!customerInfo.name) {
        console.log('No customer name available, skipping auto-store');
        return;
      }
      
      // Call the customer info tool
      const customerInfoTool = this.getTool('store_customer_info');
      if (customerInfoTool) {
        console.log('Auto-storing customer info after appointment booking');
        await customerInfoTool.handler(customerInfo, this.context);
      }
    } catch (error) {
      console.error('Error in auto-storing customer info:', error);
    }
  }

  /**
   * Register default tools
   */
  private registerDefaultTools() {
    this.registerTool(TransferCallTool);
    this.registerTool(SendTextTool);
    this.registerTool(BookAppointmentTool);
    this.registerTool(NavigationTool);
    this.registerTool(CustomerInfoTool);
  }
}

// Create singleton instance
const toolManager = new ToolManager();

// Register all the tools
// This defines the order/priority of tools in the UI
const allTools = [
  NavigationTool,  // Give NavigationTool highest priority
  CustomerInfoTool,
  BookAppointmentTool,
  TransferCallTool
];

// Export the tool registration function
export const registerAllTools = () => {
  allTools.forEach(tool => {
    // Some tools export a registerTool function
    if (tool.hasOwnProperty('registerTool') && typeof (tool as any).registerTool === 'function') {
      (tool as any).registerTool();
    } else {
      // Standard tools can be registered directly
      toolManager.registerTool(tool as Tool);
    }
  });
};

export default toolManager;