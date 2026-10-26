"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  maxLength?: number;
  /** Acción junto a la etiqueta, p. ej. "¿Olvidó su contraseña?". */
  action?: ReactNode;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  minLength,
  maxLength,
  action,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#3f493f]">
        <label htmlFor={id}>{label}</label>
        {action}
      </div>
      <div className="flex h-12 items-center gap-3 rounded-xl bg-[#f2f3ff] pl-4 pr-1 focus-within:ring-2 focus-within:ring-[#15803d]">
        <Icon className="text-lg text-[#6f7a6e]" name="lock" />
        {/* text-base (16px): con menos, iOS Safari hace zoom al enfocar el campo. */}
        <input
          autoComplete={autoComplete}
          className="h-full min-w-0 flex-1 bg-transparent text-base outline-none"
          id={id}
          maxLength={maxLength}
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          required
          type={visible ? "text" : "password"}
          value={value}
        />
        <button
          aria-controls={id}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#6f7a6e] hover:bg-[#e2e7ff]"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          <Icon className="text-lg" name={visible ? "eyeOff" : "eye"} />
        </button>
      </div>
    </div>
  );
}
