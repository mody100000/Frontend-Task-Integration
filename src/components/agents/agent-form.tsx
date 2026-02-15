"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReferenceData } from "@/hooks/use-reference-data";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useAgentForm } from "@/hooks/use-agent-form";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { CollapsibleSection } from "@/components/agents/collapsible-section";
import { BasicSettings } from "@/components/agents/sections/basic-settings";
import { CallScript } from "@/components/agents/sections/call-script";
import { ServiceDescription } from "@/components/agents/sections/service-description";
import { ReferenceData } from "@/components/agents/sections/reference-data";
import { ToolsSection } from "@/components/agents/sections/tools-section";
import { TestCallCard } from "@/components/agents/sections/test-call-card";
import { AgentFormValues } from "@/schemas/agent.schema";

export interface AgentFormProps {
  mode: "create" | "edit";
  initialData?: Partial<AgentFormValues>;
}

export function AgentForm({ mode, initialData }: AgentFormProps) {
  const { languages, voices, prompts, models, loading, error, retry } =
    useReferenceData();

  const fileUpload = useFileUpload();

  const [allowHangUp, setAllowHangUp] = useState(false);
  const [allowCallback, setAllowCallback] = useState(false);
  const [liveTransfer, setLiveTransfer] = useState(false);

  const {
    agentForm,
    testCallForm,
    saving,
    testing,
    handleSaveSubmit,
    handleTestCallSubmit,
    resetAll,
  } = useAgentForm({
    initialData,
    attachmentIds: fileUpload.attachmentIds,
    tools: { allowHangUp, allowCallback, liveTransfer },
    onReset: () => {
      fileUpload.resetFiles();
      setAllowHangUp(false);
      setAllowCallback(false);
      setLiveTransfer(false);
    },
  });

  useUnsavedChangesWarning(agentForm.formState.isDirty);

  const watched = agentForm.watch([
    "agentName",
    "callType",
    "language",
    "voice",
    "prompt",
    "model",
  ]);
  const basicSettingsMissing = watched.filter((v) => !v).length;

  const heading = mode === "create" ? "Create Agent" : "Edit Agent";
  const saveLabel = mode === "create" ? "Save Agent" : "Save Changes";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* API error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-md border border-destructive bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{heading}</h1>
        <Button
          type="button"
          onClick={() => void handleSaveSubmit()}
          disabled={saving || loading}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saveLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* 1. Basic Settings */}
          <CollapsibleSection
            title="Basic Settings"
            description="Add some information about your agent to get started."
            badge={basicSettingsMissing}
            defaultOpen
          >
            <BasicSettings
              form={agentForm}
              languages={languages}
              voices={voices}
              prompts={prompts}
              models={models}
              loading={loading}
            />
          </CollapsibleSection>

          {/* 2. Call Script */}
          <CollapsibleSection
            title="Call Script"
            description="What would you like the AI agent to say during the call?"
          >
            <CallScript form={agentForm} />
          </CollapsibleSection>

          {/* 3. Service / Product Description */}
          <CollapsibleSection
            title="Service/Product Description"
            description="Add a knowledge base about your service or product."
          >
            <ServiceDescription form={agentForm} />
          </CollapsibleSection>

          {/* 4. Reference Data */}
          <CollapsibleSection
            title="Reference Data"
            description="Enhance your agent's knowledge base with uploaded files."
          >
            <ReferenceData
              uploadedFiles={fileUpload.uploadedFiles}
              isDragging={fileUpload.isDragging}
              fileInputRef={fileUpload.fileInputRef}
              handleFiles={fileUpload.handleFiles}
              handleDragOver={fileUpload.handleDragOver}
              handleDragLeave={fileUpload.handleDragLeave}
              handleDrop={fileUpload.handleDrop}
              removeFile={fileUpload.removeFile}
            />
          </CollapsibleSection>

          {/* 5. Tools */}
          <CollapsibleSection
            title="Tools"
            description="Tools that allow the AI agent to perform call-handling actions."
          >
            <ToolsSection
              allowHangUp={allowHangUp}
              allowCallback={allowCallback}
              liveTransfer={liveTransfer}
              onAllowHangUpChange={setAllowHangUp}
              onAllowCallbackChange={setAllowCallback}
              onLiveTransferChange={setLiveTransfer}
            />
          </CollapsibleSection>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <TestCallCard
              form={testCallForm}
              onSubmit={(e) => {
                e.preventDefault();
                void handleTestCallSubmit(e);
              }}
              testing={testing}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom save bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          {agentForm.formState.isDirty && (
            <p className="text-sm text-muted-foreground">
              You have unsaved changes.
            </p>
          )}
          <div className="flex gap-2 ml-auto">
            {mode === "create" && (
              <Button
                type="button"
                variant="outline"
                onClick={resetAll}
                disabled={saving}
              >
                Reset
              </Button>
            )}
            <Button
              type="button"
              onClick={() => void handleSaveSubmit()}
              disabled={saving || loading}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saveLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
