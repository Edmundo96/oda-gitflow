import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

type Tone = "error" | "success" | "info";

const tones: Record<Tone, { icon: IconName; className: string }> = {
  error: { icon: "error", className: "bg-[#ffdad6] text-[#93000a]" },
  success: { icon: "success", className: "bg-[#d7f8de] text-[#00521f]" },
  info: { icon: "info", className: "bg-[#f2f3ff] text-[#3f493f]" },
};

interface FormAlertProps {
  tone?: Tone;
  children: ReactNode;
}

export function FormAlert({ tone = "info", children }: FormAlertProps) {
  return (
    <div
      className={`flex items-start gap-2 rounded-xl p-3 text-sm ${tones[tone].className}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 text-base" name={tones[tone].icon} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
