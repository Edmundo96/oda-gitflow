import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface BottomNavigationProps {
  active: "pos" | "inventory";
}

const links = [
  { href: "/pos", label: "POS", icon: "pos", key: "pos" },
  { href: "/inventory", label: "Inventario", icon: "inventory", key: "inventory" },
  { href: "#", label: "Reportes", icon: "reports", key: "reports" },
  { href: "#", label: "Ajustes", icon: "settings", key: "settings" },
] as const;

export function BottomNavigation({ active }: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#eaedff] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.05)] backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-around">
        {links.map((link) => {
          const selected = link.key === active;
          const content = (
            <>
              <Icon className="text-2xl" name={link.icon} />
              <span className="text-[11px] font-semibold">{link.label}</span>
            </>
          );
          const className = `flex min-w-16 flex-col items-center justify-center gap-0.5 ${
            selected ? "text-[#00652c]" : "text-[#6f7a6e]"
          }`;

          return link.href === "#" ? (
            <span aria-disabled="true" className={`${className} opacity-60`} key={link.key}>
              {content}
            </span>
          ) : (
            <Link
              aria-current={selected ? "page" : undefined}
              className={className}
              href={link.href}
              key={link.key}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
