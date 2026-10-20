interface StatusDotProps {
  className?: string;
}

// Indicador de estado (en línea / disponible) dibujado con CSS, sin caracteres tipográficos.
export function StatusDot({ className = "bg-[#00652c]" }: StatusDotProps) {
  return <span aria-hidden="true" className={`inline-block h-2 w-2 shrink-0 rounded-full ${className}`} />;
}
