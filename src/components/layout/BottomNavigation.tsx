"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Role } from "@/types/user";

type Section = "pos" | "inventory" | "settings";

interface BottomNavigationProps {
  active: Section;
}

interface NavLink {
  key: Section | "reports";
  label: string;
  icon: IconName;
  /** null = sección pendiente (se muestra deshabilitada). */
  href: string | null;
  /** Si se indica, solo esos roles ven el enlace. */
  roles?: Role[];
}

const links: NavLink[] = [
  { key: "pos", label: "POS", icon: "cart", href: "/pos" },
  { key: "inventory", label: "Inventario", icon: "inventory", href: "/inventory" },
  { key: "reports", label: "Reportes", icon: "reports", href: null },
  { key: "settings", label: "Ajustes", icon: "settings", href: "/settings", roles: ["administrador"] },
];

export function BottomNavigation({ active }: BottomNavigationProps) {
  const { user } = useAuth();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#eaedff] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.05)] backdrop-blur px-safe"
    >
      <div className="mx-auto flex h-(--nav-h) max-w-md items-stretch justify-around">
        {links
          .filter((link) => !link.roles || link.roles.includes(user.role))
          .map((link) => {
            const selected = link.key === active;
            const content = (
              <>
                <Icon className="text-2xl short:text-xl" name={link.icon} />
                {/* En pantallas bajas solo se ve el icono; el texto sigue disponible para lectores de pantalla. */}
                <span className="text-[11px] font-semibold short:sr-only">{link.label}</span>
              </>
            );
            const className = `flex min-w-16 flex-1 flex-col items-center justify-center gap-0.5 ${
              selected ? "text-[#00652c]" : "text-[#6f7a6e]"
            }`;

            return link.href ? (
              <Link aria-current={selected ? "page" : undefined} className={className} href={link.href} key={link.key}>
                {content}
              </Link>
            ) : (
              <span aria-disabled="true" className={`${className} opacity-60`} key={link.key}>
                {content}
              </span>
            );
          })}
      </div>
    </nav>
  );
}
