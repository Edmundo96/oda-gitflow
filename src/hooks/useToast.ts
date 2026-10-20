"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastTone = "success" | "error" | "info";

export interface ToastMessage {
  text: string;
  tone: ToastTone;
}

interface ShowToastOptions {
  tone?: ToastTone;
  durationMs?: number;
}

export function useToast() {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const showToast = useCallback((text: string, { tone = "info", durationMs = 2000 }: ShowToastOptions = {}) => {
    window.clearTimeout(timeoutRef.current);
    setMessage({ text, tone });
    timeoutRef.current = window.setTimeout(() => setMessage(null), durationMs);
  }, []);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return { message, showToast };
}
