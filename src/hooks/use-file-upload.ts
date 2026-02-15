"use client";

import { ACCEPTED_EXTENSIONS } from "@/constants/agent.constants";
import { apiPost, uploadFileToBucket } from "@/lib/api-client";
import { Attachment, UploadedFile } from "@/types/agent.types";
import { useState, useCallback, useRef } from "react";

export const ACCEPTED_TYPES = ACCEPTED_EXTENSIONS.join(",");

interface UseFileUploadReturn {
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  attachmentIds: string[];
  handleFiles: (files: FileList | null) => Promise<void>;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  removeFile: (index: number) => void;
  resetFiles: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const attachmentIds = uploadedFiles
    .filter((f) => f.attachmentId && !f.error)
    .map((f) => f.attachmentId!);

  const uploadSingleFile = useCallback(async (uploadedFile: UploadedFile) => {
    try {
      // Step 1: Get signed upload URL
      const { key, signedUrl } = await apiPost<{
        key: string;
        signedUrl: string;
        expiresIn: number;
      }>("/attachments/upload-url", {});

      // Step 2: PUT file to signed URL
      await uploadFileToBucket(signedUrl, uploadedFile.file);

      // Step 3: Register the attachment
      const attachment = await apiPost<Attachment>("/attachments", {
        key,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        mimeType: uploadedFile.file.type || "application/octet-stream",
      });

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f === uploadedFile
            ? { ...f, uploading: false, attachmentId: attachment.id }
            : f,
        ),
      );
    } catch (err) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f === uploadedFile
            ? {
                ...f,
                uploading: false,
                error: err instanceof Error ? err.message : "Upload failed",
              }
            : f,
        ),
      );
    }
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");

        if (!ACCEPTED_EXTENSIONS.includes(ext)) continue;

        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          file,
          uploading: true,
        };
        newFiles.push(uploadedFile);
      }

      if (newFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        newFiles.forEach((f) => void uploadSingleFile(f));
      }
    },
    [uploadSingleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      void handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploadedFiles,
    isDragging,
    fileInputRef,
    attachmentIds,
    handleFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    resetFiles,
  };
}
