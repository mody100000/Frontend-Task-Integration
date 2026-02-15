"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Phone, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestCallValues } from "@/schemas/agent.schema";

interface TestCallCardProps {
  form: UseFormReturn<TestCallValues>;
  onSubmit: (e: React.FormEvent) => void;
  testing: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export function TestCallCard({ form, onSubmit, testing }: TestCallCardProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Test Call
        </CardTitle>
        <CardDescription>
          Make a test call to preview your agent. Each test call will deduct
          credits from your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="test-first-name">First Name</Label>
              <Input
                id="test-first-name"
                placeholder="John"
                {...register("testFirstName")}
                aria-invalid={!!errors.testFirstName}
              />
              <FieldError message={errors.testFirstName?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="test-last-name">Last Name</Label>
              <Input
                id="test-last-name"
                placeholder="Doe"
                {...register("testLastName")}
                aria-invalid={!!errors.testLastName}
              />
              <FieldError message={errors.testLastName?.message} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Gender</Label>
            <Controller
              control={control}
              name="testGender"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.testGender}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.testGender?.message} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="test-phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="testPhone"
              render={({ field }) => (
                <PhoneInput
                  defaultCountry="EG"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter phone number"
                />
              )}
            />
            <FieldError message={errors.testPhone?.message} />
          </div>

          <Button type="submit" className="w-full" disabled={testing}>
            {testing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Phone className="mr-2 h-4 w-4" />
            )}
            Start Test Call
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
