import { z } from "zod";

export const agentFormSchema = z.object({
  agentName: z.string().min(1, "Agent name is required"),
  description: z.string().optional(),
  callType: z.string().min(1, "Call type is required"),
  language: z.string().min(1, "Language is required"),
  voice: z.string().min(1, "Voice is required"),
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().min(1, "Model is required"),
  latency: z.number().min(0.3).max(1),
  speed: z.number().min(90).max(130),
  callScript: z.string().optional(),
  serviceDescription: z.string().optional(),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;

export const testCallSchema = z.object({
  testFirstName: z.string().min(1, "First name is required"),
  testLastName: z.string().min(1, "Last name is required"),
  testGender: z.string().min(1, "Gender is required"),
  testPhone: z.string().min(1, "Phone number is required"),
});

export type TestCallValues = z.infer<typeof testCallSchema>;
