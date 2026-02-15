"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { apiPost, apiPut } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  agentFormSchema,
  AgentFormValues,
  testCallSchema,
  TestCallValues,
} from "@/schemas/agent.schema";
import {
  agentFormDefaults,
  testCallDefaults,
} from "@/constants/agent.constants";
import { Agent, TestCallResponse } from "@/types/agent.types";

interface UseAgentFormOptions {
  initialData?: Partial<AgentFormValues>;
  attachmentIds: string[];
  tools: {
    allowHangUp: boolean;
    allowCallback: boolean;
    liveTransfer: boolean;
  };
  onSaveSuccess?: (id: string) => void;
  onReset?: () => void;
}

export function useAgentForm({
  initialData,
  attachmentIds,
  tools,
  onSaveSuccess,
  onReset,
}: UseAgentFormOptions) {
  const { toast } = useToast();

  const agentForm = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: { ...agentFormDefaults, ...initialData },
    mode: "onTouched",
  });

  const testCallForm = useForm<TestCallValues>({
    resolver: zodResolver(testCallSchema),
    defaultValues: testCallDefaults,
    mode: "onTouched",
  });

  const [agentId, setAgentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const buildPayload = useCallback(
    (values: AgentFormValues) => ({
      name: values.agentName.trim(),
      description: (values.description ?? "").trim(),
      callType: values.callType,
      language: values.language,
      voice: values.voice,
      prompt: values.prompt,
      model: values.model,
      latency: values.latency,
      speed: values.speed,
      callScript: (values.callScript ?? "").trim(),
      serviceDescription: (values.serviceDescription ?? "").trim(),
      attachments: attachmentIds,
      tools,
    }),
    [attachmentIds, tools],
  );

  const saveAgent = useCallback(
    async (
      values: AgentFormValues,
      options: { showSuccess?: boolean } = {},
    ): Promise<string | null> => {
      const { showSuccess = true } = options;

      try {
        setSaving(true);
        const payload = buildPayload(values);
        let saved: Agent;

        if (agentId) {
          saved = await apiPut<Agent>(`/agents/${agentId}`, payload);
        } else {
          saved = await apiPost<Agent>("/agents", payload);
          setAgentId(saved.id);
        }

        agentForm.reset(values);

        if (showSuccess) {
          toast({
            title: "Agent saved",
            description: `"${saved.name}" has been saved successfully.`,
          });
        }

        onSaveSuccess?.(saved.id);
        return saved.id;
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Save failed",
          description:
            err instanceof Error ? err.message : "An unknown error occurred.",
        });
        return null;
      } finally {
        setSaving(false);
      }
    },
    [agentId, agentForm, buildPayload, onSaveSuccess, toast],
  );

  const handleSaveSubmit = agentForm.handleSubmit((values) =>
    saveAgent(values, { showSuccess: true }),
  );

  const handleTestCallSubmit = testCallForm.handleSubmit(async (testValues) => {
    // If the agent form is dirty, auto-save first
    let effectiveId = agentId;
    if (!effectiveId || agentForm.formState.isDirty) {
      const agentValues = agentForm.getValues();
      const valid = await agentForm.trigger();
      if (!valid) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description:
            "Please fix the agent form errors before starting a test call.",
        });
        return;
      }
      effectiveId = await saveAgent(agentValues, { showSuccess: false });
    }

    if (!effectiveId) return;

    try {
      setTesting(true);
      const result = await apiPost<TestCallResponse>(
        `/agents/${effectiveId}/test-call`,
        {
          firstName: testValues.testFirstName,
          lastName: testValues.testLastName,
          gender: testValues.testGender,
          phoneNumber: testValues.testPhone,
        },
      );

      toast({
        title: "Test call started",
        description:
          "Your test call is now in progress. You will be notified once it connects.",
      });

      testCallForm.reset();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Test call failed",
        description:
          err instanceof Error ? err.message : "An unknown error occurred.",
      });
    } finally {
      setTesting(false);
    }
  });

  const resetAll = useCallback(() => {
    agentForm.reset({ ...agentFormDefaults, ...initialData });
    testCallForm.reset(testCallDefaults);
    setAgentId(null);
    onReset?.();
  }, [agentForm, testCallForm, initialData, onReset]);

  return {
    agentForm,
    testCallForm,
    agentId,
    saving,
    testing,
    handleSaveSubmit,
    handleTestCallSubmit,
    resetAll,
  };
}
