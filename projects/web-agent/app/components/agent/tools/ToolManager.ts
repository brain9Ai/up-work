'use client';

import CustomerInfoTool from './CustomerInfoTool';
import AppointmentTool from './AppointmentTool';
import ContactTool from './ContactTool';

interface Tool {
  definition: {
    type: string;
    function: {
      name: string;
      description: string;
      parameters: any;
    };
  };
  handler: (args: any, context: any) => any;
}

class ToolManager {
  private tools: Map<string, Tool> = new Map();
  private context: any = {};

  constructor(context: any = {}) {
    this.context = context;
    this.registerDefaultTools();
  }

  private registerDefaultTools() {
    this.registerTool(CustomerInfoTool);
    this.registerTool(AppointmentTool);
    this.registerTool(ContactTool);
  }

  registerTool(tool: Tool) {
    const name = tool.definition.function.name;
    this.tools.set(name, tool);
    console.log(`Registered tool: ${name}`);
    return this;
  }

  getToolDefinitions() {
    return Array.from(this.tools.values()).map(tool => tool.definition);
  }

  async executeTool(name: string, args: any) {
    const tool = this.tools.get(name);
    if (!tool) {
      console.error(`Tool not found: ${name}`);
      return {
        success: false,
        message: `Tool '${name}' not found`,
      };
    }

    try {
      console.log(`Executing tool: ${name}`, args);
      return await tool.handler(args, this.context);
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      return {
        success: false,
        message: `Error executing tool: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  updateContext(newContext: any) {
    this.context = { ...this.context, ...newContext };
    return this;
  }
}

export default ToolManager; 
 
 