"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FormAlert } from "@/components/auth/FormAlert";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { EmployeeForm } from "@/components/settings/EmployeeForm";
import { EmployeeList } from "@/components/settings/EmployeeList";
import { Icon } from "@/components/ui/Icon";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { ApiError, apiFetch } from "@/lib/api";
import type { AppUser } from "@/types/user";

function EmployeesManager({ currentUserId }: { currentUserId: string }) {
  const [employees, setEmployees] = useState<AppUser[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { message: toast, showToast } = useToast();

  useEffect(() => {
    apiFetch<AppUser[]>("/users")
      .then(setEmployees)
      .catch((error: unknown) =>
        setLoadError(error instanceof ApiError ? error.message : "No se pudo cargar la lista de empleados."),
      );
  }, []);

  async function updateEmployee(employee: AppUser, changes: Partial<Pick<AppUser, "role" | "active">>) {
    setPendingId(employee.id);
    try {
      const updated = await apiFetch<AppUser>(`/users/${employee.id}`, { method: "PATCH", json: changes });
      setEmployees((current) => current?.map((item) => (item.id === updated.id ? updated : item)) ?? null);
      showToast(`${updated.name} actualizado`, { tone: "success" });
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "No se pudo guardar el cambio", { tone: "error" });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl bg-[#f2f3ff] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#00652c] shadow-sm">
          <Icon className="text-xl" name="users" />
        </span>
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight">Empleados</h1>
          <p className="text-xs text-[#6f7a6e]">
            Los vendedores pueden crear su cuenta; aquí cambias roles, desactivas accesos o das de alta a alguien.
            Las cuentas desactivadas aparecen primero.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <section aria-label="Lista de empleados" className="min-w-0">
          {loadError ? (
            <FormAlert tone="error">{loadError}</FormAlert>
          ) : employees === null ? (
            <p className="flex items-center gap-2 rounded-2xl bg-white p-6 text-sm text-[#6f7a6e]" role="status">
              <Icon className="animate-spin text-lg" name="loader" /> Cargando empleados...
            </p>
          ) : (
            <EmployeeList
              currentUserId={currentUserId}
              employees={employees}
              onChange={(employee, changes) => void updateEmployee(employee, changes)}
              pendingId={pendingId}
            />
          )}
        </section>
        <div className="lg:sticky lg:top-20">
          <EmployeeForm
            onCreated={(employee) => {
              setEmployees((current) => [employee, ...(current ?? [])]);
              showToast(`${employee.name} dado de alta`, { tone: "success" });
            }}
          />
        </div>
      </div>
      <Toast message={toast} />
    </>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-dvh bg-[#faf8ff] pb-nav text-[#131b2e]">
      <AppHeader subtitle="Ajustes" />
      <main className="mx-auto max-w-7xl space-y-4 py-4 px-safe">
        {user.role === "administrador" ? (
          <EmployeesManager currentUserId={user.id} />
        ) : (
          <FormAlert tone="error">Solo el administrador puede gestionar los empleados.</FormAlert>
        )}
      </main>
      <BottomNavigation active="settings" />
    </div>
  );
}
