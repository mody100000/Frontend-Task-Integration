"use client";

import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/api-client";
import type { UploadedFile } from "@/types/agent.types";
import { ACCEPTED_TYPES } from "@/hooks/use-file-upload";

export interface ReferenceDataProps {
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFiles: (files: FileList | null) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  removeFile: (index: number) => void;
}

export function ReferenceData({
  uploadedFiles,
  isDragging,
  fileInputRef,
  handleFiles,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  removeFile,
}: ReferenceDataProps) {
  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/40"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept={ACCEPTED_TYPES}
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">
          Drag & drop files here, or{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => fileInputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Accepted: .pdf, .doc, .docx, .txt, .csv, .xlsx, .xls
        </p>
      </div>

      {/* File list */}
      {uploadedFiles.length > 0 ? (
        <div className="space-y-2">
          {uploadedFiles.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                {f.uploading ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                ) : f.error ? (
                  <X className="h-4 w-4 shrink-0 text-destructive" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="text-sm truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatFileSize(f.size)}
                </span>
                {f.uploading && <Badge variant="secondary">Uploading…</Badge>}
                {f.error && (
                  <Badge variant="destructive" title={f.error}>
                    Failed
                  </Badge>
                )}
                {f.attachmentId && <Badge variant="default">Uploaded</Badge>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-7 w-7 shrink-0"
                onClick={() => removeFile(i)}
                disabled={f.uploading}
                aria-label={`Remove ${f.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
          <FileText className="h-10 w-10 mb-2" />
          <p className="text-sm">No files uploaded yet</p>
        </div>
      )}
    </div>
  );
}
