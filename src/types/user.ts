/** Roles de la base de datos (public.usuarios.rol). */
export type Role = "administrador" | "cajero";

/** Perfil del sistema devuelto por la API (GET /auth/me, /users). */
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  phone: string | null;
  address: string | null;
  createdAt: string;
}

export const ROLES: Role[] = ["cajero", "administrador"];

export const roleLabels: Record<Role, string> = {
  administrador: "Administrador",
  cajero: "Cajero",
};
