"use client";

import { useState, type SubmitEvent } from "react";
import { FormAlert } from "@/components/auth/FormAlert";
import { TextField } from "@/components/auth/TextField";
import { Icon } from "@/components/ui/Icon";
import { ApiError, apiFetch } from "@/lib/api";
import { ROLES, roleLabels, type AppUser, type Role } from "@/types/user";

const MIN_PASSWORD = 8;

/** Contraseña temporal aleatoria (sin caracteres que se confundan al dictarla: 0/O, 1/l/I). */
function generatePassword(length = 12): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}

interface EmployeeFormProps {
  onCreated: (employee: AppUser) => void;
}

export function EmployeeForm({ onCreated }: EmployeeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("cajero");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const employee = await apiFetch<AppUser>("/users", {
        method: "POST",
        json: { name: name.trim(), email: email.trim(), role, password, ...(phone.trim() ? { phone: phone.trim() } : {}) },
      });
      onCreated(employee);
      setCreated({ email: employee.email, password });
      setCopied(false);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "No se pudo crear el empleado.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCredentials() {
    if (!created) return;
    await navigator.clipboard.writeText(`Correo: ${created.email}\nContraseña temporal: ${created.password}`);
    setCopied(true);
  }

  return (
    <section aria-labelledby="new-employee" className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <h2 className="flex items-center gap-2 font-bold" id="new-employee">
        <Icon className="text-[#00652c]" name="userAdd" /> Nuevo empleado
      </h2>
      <p className="mt-1 text-xs text-[#6f7a6e]">
        Podrá entrar con este correo y la contraseña temporal, o con Google si el correo es de Google.
      </p>

      {created && (
        <div className="mt-4">
          <FormAlert tone="success">
            <p>Empleado creado. Comparte sus datos de acceso:</p>
            <p className="mt-1 break-all font-mono text-xs">
              {created.email}
              <br />
              {created.password}
            </p>
            <button
              className="mt-2 flex min-h-10 items-center gap-1.5 rounded-lg bg-white/70 px-3 text-xs font-semibold"
              onClick={() => void copyCredentials()}
              type="button"
            >
              <Icon name={copied ? "success" : "clipboard"} /> {copied ? "Copiado" : "Copiar datos"}
            </button>
          </FormAlert>
        </div>
      )}

      <form className="mt-4 space-y-4" onSubmit={submit}>
        {error && <FormAlert tone="error">{error}</FormAlert>}
        <TextField icon="user" id="employee-name" label="Nombre" maxLength={150} onChange={setName} required value={name} />
        <TextField
          autoCapitalize="none"
          icon="mail"
          id="employee-email"
          label="Correo electrónico"
          onChange={setEmail}
          required
          spellCheck={false}
          type="email"
          value={email}
        />
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#3f493f]" htmlFor="employee-role">
            Rol
          </label>
          <select
            className="h-12 w-full rounded-xl bg-[#f2f3ff] px-4 text-base outline-none focus:ring-2 focus:ring-[#15803d]"
            id="employee-role"
            onChange={(event) => setRole(event.target.value as Role)}
            value={role}
          >
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {roleLabels[item]}
              </option>
            ))}
          </select>
        </div>
        <TextField
          autoComplete="off"
          icon="support"
          id="employee-phone"
          inputMode="tel"
          label="Teléfono (opcional)"
          maxLength={30}
          onChange={setPhone}
          pattern="[0-9+()\s-]*"
          type="tel"
          value={phone}
        />
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#3f493f]">
            <label htmlFor="employee-password">Contraseña temporal</label>
            <button
              className="-my-2 flex items-center gap-1 rounded-md px-1 py-2.5 text-[#00652c]"
              onClick={() => setPassword(generatePassword())}
              type="button"
            >
              <Icon name="dice" /> Generar
            </button>
          </div>
          <div className="flex h-12 items-center gap-3 rounded-xl bg-[#f2f3ff] px-4 focus-within:ring-2 focus-within:ring-[#15803d]">
            <Icon className="text-lg text-[#6f7a6e]" name="key" />
            {/* Visible a propósito: el administrador debe compartirla con el empleado. */}
            <input
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent font-mono text-base outline-none"
              id="employee-password"
              minLength={MIN_PASSWORD}
              onChange={(event) => setPassword(event.target.value)}
              required
              spellCheck={false}
              type="text"
              value={password}
            />
          </div>
        </div>
        <button
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] font-semibold text-white transition hover:bg-[#00652c] disabled:cursor-wait disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          <Icon className={loading ? "animate-spin" : ""} name={loading ? "loader" : "userAdd"} />
          {loading ? "Creando..." : "Dar de alta"}
        </button>
      </form>
    </section>
  );
}
