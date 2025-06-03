// Type definitions for VAPI Web SDK
declare module '@vapi-ai/web' {
  export class VapiWebClient {
    constructor(options: { apiKey: string });
    start(options: VapiStartOptions): VapiCall;
    stop(): void;
  }

  interface VapiStartOptions {
    assistantId: string;
    functions?: VapiFunction[];
    initialMemory?: {
      transient?: Record<string, any>;
      persistent?: Record<string, any>;
      [key: string]: any;
    };
    headers?: Record<string, string>;
    messages?: Array<{
      role: 'assistant' | 'user' | 'system';
      content: string;
    }>;
    voice?: {
      voiceId?: string;
      modelId?: string;
    };
    [key: string]: any;
  }

  interface VapiFunction {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, any>;
      required?: string[];
    };
    handler: (params: any) => any;
  }

  interface VapiCall {
    callId: string;
    stop: () => void;
    sendMessage: (message: string) => void;
    setTranscript: (transcript: string) => void;
    on(event: 'call-start' | 'call-end' | 'assistant-end' | 'error' | 'message', handler: (data?: any) => void): void;
    [key: string]: any;
  }
} 