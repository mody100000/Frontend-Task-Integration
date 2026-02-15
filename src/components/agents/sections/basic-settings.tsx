"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgentFormValues } from "@/schemas/agent.schema";
import { Language, Model, Prompt, Voice } from "@/types/agent.types";

interface BasicSettingsProps {
  form: UseFormReturn<AgentFormValues>;
  languages: Language[];
  voices: Voice[];
  prompts: Prompt[];
  models: Model[];
  loading: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

function SelectSkeleton() {
  return <Skeleton className="h-9 w-full rounded-md" />;
}

export function BasicSettings({
  form,
  languages,
  voices,
  prompts,
  models,
  loading,
}: BasicSettingsProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const latency = watch("latency");
  const speed = watch("speed");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Agent Name */}
      <div className="space-y-1">
        <Label htmlFor="agent-name">
          Agent Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="agent-name"
          placeholder="e.g. Sales Assistant"
          {...register("agentName")}
          aria-invalid={!!errors.agentName}
        />
        <FieldError message={errors.agentName?.message} />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Describe what this agent does..."
          {...register("description")}
        />
      </div>

      {/* Call Type */}
      <div className="space-y-1">
        <Label>
          Call Type <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="callType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className="w-full"
                aria-invalid={!!errors.callType}
              >
                <SelectValue placeholder="Select call type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbound">Inbound (Receive Calls)</SelectItem>
                <SelectItem value="outbound">Outbound (Make Calls)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.callType?.message} />
      </div>

      {/* Language */}
      <div className="space-y-1">
        <Label>
          Language <span className="text-destructive">*</span>
        </Label>
        {loading ? (
          <SelectSkeleton />
        ) : (
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.language}
                >
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        <FieldError message={errors.language?.message} />
      </div>

      {/* Voice */}
      <div className="space-y-1">
        <Label>
          Voice <span className="text-destructive">*</span>
        </Label>
        {loading ? (
          <SelectSkeleton />
        ) : (
          <Controller
            control={control}
            name="voice"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" aria-invalid={!!errors.voice}>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex items-center gap-2">
                        <span>{v.name}</span>
                        <Badge
                          variant={
                            v.tag === "Premium" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {v.tag}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        <FieldError message={errors.voice?.message} />
      </div>

      {/* Prompt */}
      <div className="space-y-1">
        <Label>
          Prompt <span className="text-destructive">*</span>
        </Label>
        {loading ? (
          <SelectSkeleton />
        ) : (
          <Controller
            control={control}
            name="prompt"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.prompt}
                >
                  <SelectValue placeholder="Select prompt" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div>
                        <div>{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        <FieldError message={errors.prompt?.message} />
      </div>

      {/* Model */}
      <div className="space-y-1">
        <Label>
          Model <span className="text-destructive">*</span>
        </Label>
        {loading ? (
          <SelectSkeleton />
        ) : (
          <Controller
            control={control}
            name="model"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" aria-invalid={!!errors.model}>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div>
                        <div>{m.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        <FieldError message={errors.model?.message} />
      </div>

      {/* Sliders */}
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Latency ({latency.toFixed(1)}s)</Label>
          <Slider
            value={[latency]}
            onValueChange={([v]) =>
              setValue("latency", v, { shouldDirty: true })
            }
            min={0.3}
            max={1}
            step={0.1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.3s</span>
            <span>1.0s</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Speed ({speed}%)</Label>
          <Slider
            value={[speed]}
            onValueChange={([v]) => setValue("speed", v, { shouldDirty: true })}
            min={90}
            max={130}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>90%</span>
            <span>130%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
