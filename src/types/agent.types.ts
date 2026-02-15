export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Voice {
  id: string;
  name: string;
  tag: string;
  language: string;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
}

export interface Attachment {
  id: string;
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  callType: string;
  language: string;
  voice: string;
  prompt: string;
  model: string;
  latency: number;
  speed: number;
  callScript: string;
  serviceDescription: string;
  attachments: string[];
  tools: {
    allowHangUp: boolean;
    allowCallback: boolean;
    liveTransfer: boolean;
  };
}

export interface TestCallResponse {
  success: boolean;
  callId: string;
  agentId: string;
  status: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  file: File;
  uploading?: boolean;
  attachmentId?: string;
  error?: string;
}
