"use client";

import type { FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

interface ProductSearchProps {
  query: string;
  onSearch: (query: string) => void;
  onScan: (barcode: string) => void;
}

export function ProductSearch({ query, onSearch, onScan }: ProductSearchProps) {
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) onScan(value);
    else onSearch("");
  }

  return (
    <form
      className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm"
      onSubmit={submitSearch}
      role="search"
    >
      <Icon className="ml-2 text-2xl text-[#00652c]" name="barcode" />
      <input
        aria-label="Buscar o escanear producto"
        className="min-w-0 flex-1 rounded-xl bg-[#f2f3ff] px-3 py-3 text-sm outline-none placeholder:text-[#6f7a6e] focus:ring-2 focus:ring-[#15803d]"
        onChange={(event) => {
          onSearch(event.target.value);
        }}
        placeholder="Escanear código de barras o buscar..."
        value={query}
      />
      {query && (
        <button
          aria-label="Limpiar búsqueda"
          className="rounded-lg p-2 text-[#6f7a6e] hover:bg-[#eaedff]"
          onClick={() => {
            onSearch("");
          }}
          type="button"
        >
          <Icon name="close" />
        </button>
      )}
      <button
        aria-label="Buscar producto"
        className="rounded-xl bg-[#15803d] px-4 py-3 text-white transition hover:bg-[#00652c]"
        type="submit"
      >
        <Icon name="search" />
      </button>
    </form>
  );
}
