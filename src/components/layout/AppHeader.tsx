"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { BrandMark } from "@/components/ui/BrandMark";
import { Icon } from "@/components/ui/Icon";
import { StatusDot } from "@/components/ui/StatusDot";
import { roleLabels } from "@/types/user";

interface AppHeaderProps {
  subtitle: string;
}

export function AppHeader({ subtitle }: AppHeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-[#eaedff] bg-[#faf8ff]/95 pt-[env(safe-area-inset-top)] backdrop-blur short:static">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-safe">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#15803d] text-white">
            <BrandMark className="text-2xl" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold">{user.business.name}</span>
              <span className="shrink-0 rounded-full bg-[#15803d] px-2 py-0.5 text-xs font-bold text-white">Caja 1</span>
            </div>
            <p className="flex min-w-0 items-center gap-1.5 text-xs text-[#00652c]">
              <StatusDot />
              <span className="truncate">En Línea · {subtitle}</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="flex max-w-56 items-center justify-end gap-1.5 truncate text-sm font-semibold">
              <Icon className="text-base text-[#6f7a6e]" name="user" />
              <span className="truncate">{user.name}</span>
            </p>
            <p className="text-xs text-[#6f7a6e]">{roleLabels[user.role]}</p>
          </div>
          <button
            aria-label="Cerrar sesión"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6f7a6e] transition hover:bg-[#ffdad6] hover:text-[#ba1a1a]"
            onClick={() => void signOut()}
            title="Cerrar sesión"
            type="button"
          >
            <Icon className="text-xl" name="logout" />
          </button>
        </div>
      </div>
    </header>
  );
}
