import { AgentFormValues, TestCallValues } from "@/schemas/agent.schema";

export const agentFormDefaults: AgentFormValues = {
  agentName: "",
  description: "",
  callType: "",
  language: "",
  voice: "",
  prompt: "",
  model: "",
  latency: 0.5,
  speed: 110,
  callScript: "",
  serviceDescription: "",
};

export const testCallDefaults: TestCallValues = {
  testFirstName: "",
  testLastName: "",
  testGender: "",
  testPhone: "",
};

export const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".csv",
  ".xlsx",
  ".xls",
];
