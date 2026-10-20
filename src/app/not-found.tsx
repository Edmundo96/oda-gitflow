import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#faf8ff] py-8 text-center text-[#131b2e] px-safe">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaedff] text-[#00652c]">
        <Icon className="text-3xl" name="notFound" />
      </span>
      <h1 className="text-2xl font-bold tracking-tight">Página no encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-[#6f7a6e]">
        La dirección que abriste no existe o fue movida. Regresa a una de las pantallas principales.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          className="flex min-h-11 items-center gap-2 rounded-xl bg-[#15803d] px-4 font-semibold text-white transition hover:bg-[#00652c]"
          href="/pos"
        >
          <Icon name="cart" /> Ir al POS
        </Link>
        <Link
          className="flex min-h-11 items-center gap-2 rounded-xl bg-[#eaedff] px-4 font-semibold text-[#283044] transition hover:bg-[#dae2fd]"
          href="/login"
        >
          <Icon name="home" /> Inicio de sesión
        </Link>
      </div>
    </main>
  );
}
