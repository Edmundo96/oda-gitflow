"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

type LoginMode = "credentials" | "pin";

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  function submitLogin(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setMessage("Inicio de sesión de demostración. Configura el servicio de autenticación para validar credenciales.");
  }

  function appendPin(digit: string) {
    setPin((current) => current.length < 4 ? current + digit : current);
  }

  return (
    <main className="min-h-screen bg-[#faf8ff] px-4 py-8 text-[#131b2e]">
      <div className="mx-auto flex max-w-md flex-col">
        <header className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#15803d] text-white shadow-sm">
            <Icon className="text-5xl" name="token" />
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#faf8ff] bg-[#00652c]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Ojo de Dios Abarrotero</h1>
          <p className="mt-1 text-sm text-[#6f7a6e]">Sistema de Punto de Venta &amp; Inventario</p>
          <div className="mt-4 rounded-full bg-[#e2e7ff] px-4 py-2 text-xs font-semibold text-[#3f493f]">
            <span className="text-[#00652c]">●</span> Terminal #01 <span className="px-1 text-[#becabc]">•</span>
            Sucursal Centro <span className="px-1 text-[#becabc]">•</span>
            <span className="text-[#00652c]">Listo</span>
          </div>
        </header>

        <section className="rounded-3xl bg-white p-5 shadow-lg sm:p-7">
          <div aria-label="Método de acceso" className="mb-5 flex rounded-2xl bg-[#eaedff] p-1">
            {(["credentials", "pin"] as const).map((item) => (
              <button
                aria-pressed={mode === item}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold ${
                  mode === item ? "bg-white text-[#00652c] shadow-sm" : "text-[#6f7a6e]"
                }`}
                key={item}
                onClick={() => {
                  setMode(item);
                  setMessage("");
                }}
                type="button"
              >
                <Icon name={item === "credentials" ? "badge" : "dialpad"} />
                {item === "credentials" ? "Credenciales" : "PIN Rápido"}
              </button>
            ))}
          </div>

          {mode === "credentials" ? (
            <form className="space-y-4" onSubmit={submitLogin}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#3f493f]">
                  Usuario / Correo Electrónico <span className="text-[#ba1a1a]">*</span>
                </span>
                <input
                  autoComplete="username"
                  className="h-12 w-full rounded-xl bg-[#f2f3ff] px-4 outline-none focus:ring-2 focus:ring-[#15803d]"
                  defaultValue="cajero@ojodedios.com"
                  name="username"
                  required
                  type="email"
                />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center justify-between text-sm font-semibold text-[#3f493f]">
                  Contraseña <span className="text-[#ba1a1a]">*</span>
                  <button className="text-[#00652c]" type="button">¿Olvidó clave?</button>
                </span>
                <span className="flex h-12 items-center rounded-xl bg-[#f2f3ff] pr-3 focus-within:ring-2 focus-within:ring-[#15803d]">
                  <input
                    autoComplete="current-password"
                    className="h-full min-w-0 flex-1 bg-transparent px-4 outline-none"
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="text-[#6f7a6e]"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} />
                  </button>
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#3f493f]">Turno y Asignación de Caja</span>
                <select className="h-12 w-full rounded-xl bg-[#f2f3ff] px-4 outline-none focus:ring-2 focus:ring-[#15803d]">
                  <option>Turno Matutino - Caja 1 (Principal)</option>
                  <option>Turno Matutino - Caja 2 (Express)</option>
                  <option>Turno Vespertino - Caja 1</option>
                  <option>Modo Auditoría / Supervisor</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-[#3f493f]">
                <input className="h-4 w-4 accent-[#00652c]" defaultChecked type="checkbox" />
                Recordar credenciales en este equipo
              </label>
              <button className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] text-lg font-semibold text-white shadow-sm transition hover:bg-[#00652c]" type="submit">
                Iniciar Sesión <Icon name="arrow" />
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="font-semibold">PIN de Acceso Rápido</p>
                <p className="text-sm text-[#6f7a6e]">Teclea tus 4 dígitos autorizados</p>
              </div>
              <div aria-label={`${pin.length} de 4 dígitos ingresados`} className="flex gap-3">
                {Array.from({ length: 4 }, (_, index) => (
                  <span className={`h-4 w-4 rounded-full ${index < pin.length ? "bg-[#00652c]" : "bg-[#dae2fd]"}`} key={index} />
                ))}
              </div>
              <div className="grid w-full max-w-[280px] grid-cols-3 gap-2.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                  <button
                    className="h-14 rounded-xl bg-[#f2f3ff] text-lg font-semibold hover:bg-[#e2e7ff]"
                    key={key}
                    onClick={() => key === "C" ? setPin("") : key === "⌫" ? setPin((value) => value.slice(0, -1)) : appendPin(key)}
                    type="button"
                  >
                    {key}
                  </button>
                ))}
              </div>
              <button
                className="h-12 w-full rounded-xl bg-[#15803d] font-semibold text-white disabled:opacity-50"
                disabled={pin.length !== 4}
                onClick={() => submitLogin()}
                type="button"
              >
                Entrar con PIN
              </button>
            </div>
          )}
          {message && <p aria-live="polite" className="mt-4 rounded-xl bg-[#f2f3ff] p-3 text-sm text-[#3f493f]">{message}</p>}
        </section>

        <footer className="mt-6 space-y-2 text-center text-xs text-[#6f7a6e]">
          <p><span className="text-[#00652c]">♧</span> Cifrado TLS 1.3 <span className="px-2">•</span> <span className="text-[#00652c]">⌁</span> Red Local OK</p>
          <p>Versión 2.4.0 · Soporte Técnico: <a className="font-semibold text-[#00652c]" href="tel:5589003421">(55) 8900-3421</a></p>
          <p className="font-semibold">Comercializadora Abarrotera S.A. de C.V.</p>
          <Link className="inline-block pt-3 font-semibold text-[#00652c] underline" href="/pos">Ir al POS (vista de demostración)</Link>
        </footer>
      </div>
    </main>
  );
}
