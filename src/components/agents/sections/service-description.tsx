"use client";

import { type UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import type { AgentFormValues } from "@/schemas/agent.schema";

interface ServiceDescriptionProps {
  form: UseFormReturn<AgentFormValues>;
}

export function ServiceDescription({ form }: ServiceDescriptionProps) {
  const { register, watch } = form;
  const value = watch("serviceDescription") ?? "";

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Describe your service or product..."
        {...register("serviceDescription")}
        rows={6}
        maxLength={20000}
      />
      <p className="text-xs text-muted-foreground text-right">
        {value.length}/20000
      </p>
    </div>
  );
}
