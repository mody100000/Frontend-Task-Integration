"use client";

import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

interface ToolsSectionProps {
  allowHangUp: boolean;
  allowCallback: boolean;
  liveTransfer: boolean;
  onAllowHangUpChange: (v: boolean) => void;
  onAllowCallbackChange: (v: boolean) => void;
  onLiveTransferChange: (v: boolean) => void;
}

export function ToolsSection({
  allowHangUp,
  allowCallback,
  liveTransfer,
  onAllowHangUpChange,
  onAllowCallbackChange,
  onLiveTransferChange,
}: ToolsSectionProps) {
  return (
    <FieldGroup className="w-full">
      <FieldLabel htmlFor="switch-hangup">
        <Field orientation="horizontal" className="items-center">
          <FieldContent>
            <FieldTitle>Allow hang up</FieldTitle>
            <FieldDescription>
              Allow the agent to hang up the call
            </FieldDescription>
          </FieldContent>
          <Switch
            id="switch-hangup"
            checked={allowHangUp}
            onCheckedChange={onAllowHangUpChange}
          />
        </Field>
      </FieldLabel>

      <FieldLabel htmlFor="switch-callback">
        <Field orientation="horizontal" className="items-center">
          <FieldContent>
            <FieldTitle>Allow callback</FieldTitle>
            <FieldDescription>
              Allow the agent to make callbacks
            </FieldDescription>
          </FieldContent>
          <Switch
            id="switch-callback"
            checked={allowCallback}
            onCheckedChange={onAllowCallbackChange}
          />
        </Field>
      </FieldLabel>

      <FieldLabel htmlFor="switch-transfer">
        <Field orientation="horizontal" className="items-center">
          <FieldContent>
            <FieldTitle>Live transfer</FieldTitle>
            <FieldDescription>
              Transfer the call to a human agent
            </FieldDescription>
          </FieldContent>
          <Switch
            id="switch-transfer"
            checked={liveTransfer}
            onCheckedChange={onLiveTransferChange}
          />
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
