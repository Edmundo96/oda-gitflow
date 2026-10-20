interface BrandMarkProps {
  className?: string;
}

// Logotipo: el rombo tejido de un "Ojo de Dios". Es la marca, por eso no viene del set de iconos.
export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={`h-[1em] w-[1em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 2 22 12 12 22 2 12 12 2Z" />
      <path d="m12 6 6 6-6 6-6-6 6-6Z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
