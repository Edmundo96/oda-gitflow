"use client";

import { Icon } from "@/components/ui/Icon";
import { ROLES, roleLabels, type AppUser, type Role } from "@/types/user";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

interface EmployeeListProps {
  employees: AppUser[];
  currentUserId: string;
  /** Id del empleado con un cambio en curso. */
  pendingId: string | null;
  onChange: (employee: AppUser, changes: Partial<Pick<AppUser, "role" | "active">>) => void;
}

export function EmployeeList({ employees, currentUserId, pendingId, onChange }: EmployeeListProps) {
  return (
    <ul className="grid gap-3 xl:grid-cols-2">
      {employees.map((employee) => {
        const isSelf = employee.id === currentUserId;
        const busy = pendingId === employee.id;

        return (
          <li
            className={`flex min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ${employee.active ? "" : "opacity-70"}`}
            key={employee.id}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaedff] font-bold text-[#00652c]"
              >
                {initials(employee.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {employee.name}
                  {isSelf && <span className="ml-2 text-xs font-normal text-[#6f7a6e]">(tú)</span>}
                </p>
                <p className="flex min-w-0 items-center gap-1 text-xs text-[#6f7a6e]">
                  <Icon name="mail" />
                  <span className="truncate">{employee.email}</span>
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                  employee.active ? "bg-[#95f8a7] text-[#00652c]" : "bg-[#ffdad6] text-[#ba1a1a]"
                }`}
              >
                {employee.active ? "Activo" : "Desactivado"}
              </span>
            </div>

            {/* Un administrador no puede cambiar su propio rol ni desactivarse (la API también lo impide). */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f2f3ff] p-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 text-sm" htmlFor={`role-${employee.id}`}>
                <Icon className="text-lg text-[#6f7a6e]" name="userRole" />
                <span className="sr-only">Rol de {employee.name}</span>
                <select
                  className="h-10 min-w-0 flex-1 rounded-lg bg-white px-2 text-base outline-none focus:ring-2 focus:ring-[#15803d] disabled:opacity-60 sm:text-sm"
                  disabled={isSelf || busy}
                  id={`role-${employee.id}`}
                  onChange={(event) => onChange(employee, { role: event.target.value as Role })}
                  value={employee.role}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className={`flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                  employee.active
                    ? "bg-white text-[#ba1a1a] hover:bg-[#ffdad6]"
                    : "bg-white text-[#00652c] hover:bg-[#d7f8de]"
                }`}
                disabled={isSelf || busy}
                onClick={() => onChange(employee, { active: !employee.active })}
                type="button"
              >
                <Icon
                  className={busy ? "animate-spin" : ""}
                  name={busy ? "loader" : employee.active ? "userDeactivate" : "userActivate"}
                />
                {employee.active ? "Desactivar" : "Activar"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
