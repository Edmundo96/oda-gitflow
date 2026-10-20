import type { ReactNode } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import { Icon, type IconName } from "@/components/ui/Icon";

function FooterItem({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="text-sm text-[#00652c]" name={icon} />
      {children}
    </span>
  );
}

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Marco común de las pantallas de acceso: logotipo, tarjeta y pie. */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    // Centrado vertical en pantallas altas; en pantallas bajas el contenido simplemente hace scroll.
    <main className="flex min-h-dvh flex-col justify-center bg-[#faf8ff] py-8 text-[#131b2e] px-safe">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <header className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#15803d] text-white shadow-sm">
            <BrandMark className="text-4xl" />
          </div>
          <p className="text-xl font-bold tracking-tight">Ojo de Dios Abarrotero</p>
          <p className="mt-1 text-sm text-[#6f7a6e]">Sistema de Punto de Venta &amp; Inventario</p>
        </header>

        <section className="rounded-3xl bg-white p-5 shadow-lg sm:p-7">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#6f7a6e]">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </section>

        <footer className="mt-6 space-y-2 text-center text-xs text-[#6f7a6e]">
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <FooterItem icon="shield">Conexión cifrada</FooterItem>
            <FooterItem icon="support">
              Soporte:{" "}
              <a className="font-semibold text-[#00652c]" href="tel:5589003421">
                (55) 8900-3421
              </a>
            </FooterItem>
          </p>
          <p className="flex items-center justify-center gap-1.5 font-semibold">
            <Icon className="text-sm" name="company" /> Comercializadora Abarrotera S.A. de C.V.
          </p>
        </footer>
      </div>
    </main>
  );
}
