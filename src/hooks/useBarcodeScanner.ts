"use client";

import { useEffect, useRef } from "react";

const SCAN_INTERVAL_MS = 80;
const MIN_SCAN_LENGTH = 3;

export function useBarcodeScanner(onScan: (barcode: string) => void) {
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let buffer = "";
    let lastKeyTime = 0;

    function handleKeyDown(event: KeyboardEvent) {
      const now = Date.now();

      if (event.key === "Enter") {
        if (buffer.length >= MIN_SCAN_LENGTH) {
          event.preventDefault();
          onScanRef.current(buffer);
        }
        buffer = "";
        lastKeyTime = 0;
        return;
      }

      if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) {
        buffer = "";
        lastKeyTime = 0;
        return;
      }

      if (lastKeyTime && now - lastKeyTime > SCAN_INTERVAL_MS) {
        buffer = "";
      }

      buffer += event.key;
      lastKeyTime = now;
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
