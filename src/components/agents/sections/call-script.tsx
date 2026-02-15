"use client";

import { type UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import type { AgentFormValues } from "@/schemas/agent.schema";

interface CallScriptProps {
  form: UseFormReturn<AgentFormValues>;
}

export function CallScript({ form }: CallScriptProps) {
  const { register, watch } = form;
  const value = watch("callScript") ?? "";

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Write your call script here..."
        {...register("callScript")}
        rows={6}
        maxLength={20000}
      />
      <p className="text-xs text-muted-foreground text-right">
        {value.length}/20000
      </p>
    </div>
  );
}
