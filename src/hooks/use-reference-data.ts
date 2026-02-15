"use client";

import { apiGet } from "@/lib/api-client";
import { Language, Model, Prompt, Voice } from "@/types/agent.types";
import { useState, useEffect } from "react";

interface ReferenceData {
  languages: Language[];
  voices: Voice[];
  prompts: Prompt[];
  models: Model[];
}

interface UseReferenceDataReturn extends ReferenceData {
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useReferenceData(): UseReferenceDataReturn {
  const [data, setData] = useState<ReferenceData>({
    languages: [],
    voices: [],
    prompts: [],
    models: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [languages, voices, prompts, models] = await Promise.all([
          apiGet<Language[]>("/languages"),
          apiGet<Voice[]>("/voices"),
          apiGet<Prompt[]>("/prompts"),
          apiGet<Model[]>("/models"),
        ]);

        if (!cancelled) {
          setData({ languages, voices, prompts, models });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load reference data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchAll();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => setAttempt((n) => n + 1);

  return { ...data, loading, error, retry };
}
