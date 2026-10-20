import { Icon, type IconName } from "@/components/ui/Icon";
import type { ToastMessage, ToastTone } from "@/hooks/useToast";

const toneStyles: Record<ToastTone, { icon: IconName; className: string }> = {
  success: { icon: "success", className: "text-[#95f8a7]" },
  error: { icon: "error", className: "text-[#ffb4ab]" },
  info: { icon: "info", className: "text-[#b4c5ff]" },
};

interface ToastProps {
  message: ToastMessage | null;
}

export function Toast({ message }: ToastProps) {
  // Arriba para no chocar con la barra inferior ni con el resumen del ticket en móvil.
  // La región viva siempre existe para que los lectores de pantalla anuncien cada mensaje nuevo.
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-[calc(0.75rem_+_env(safe-area-inset-top))] px-safe"
      role="status"
    >
      {message && (
        <p className="flex max-w-md items-center gap-2.5 rounded-2xl bg-[#283044] px-4 py-3 text-sm text-white shadow-xl">
          <Icon className={`text-lg ${toneStyles[message.tone].className}`} name={toneStyles[message.tone].icon} />
          {message.text}
        </p>
      )}
    </div>
  );
}
