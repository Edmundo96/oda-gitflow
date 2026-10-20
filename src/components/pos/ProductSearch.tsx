"use client";

import type { SubmitEvent } from "react";
import { Icon } from "@/components/ui/Icon";

interface ProductSearchProps {
  query: string;
  onSearch: (query: string) => void;
  onSubmit: (query: string) => void;
}

export function ProductSearch({ query, onSearch, onSubmit }: ProductSearchProps) {
  function submitSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) onSubmit(value);
    else onSearch("");
  }

  return (
    <form
      className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm"
      onSubmit={submitSearch}
      role="search"
    >
      <Icon className="ml-2 hidden text-2xl text-[#00652c] min-[360px]:block" name="barcode" />
      {/* text-base (16px): con menos, iOS Safari hace zoom al enfocar el campo. */}
      <input
        aria-label="Buscar o escanear producto"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-xl bg-[#f2f3ff] px-3 py-2.5 text-base outline-none placeholder:text-sm placeholder:text-[#6f7a6e] focus:ring-2 focus:ring-[#15803d]"
        enterKeyHint="search"
        onChange={(event) => {
          onSearch(event.target.value);
        }}
        placeholder="Escanear código o buscar..."
        value={query}
      />
      {query && (
        <button
          aria-label="Limpiar búsqueda"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#6f7a6e] hover:bg-[#eaedff]"
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
        className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-[#15803d] text-white transition hover:bg-[#00652c]"
        type="submit"
      >
        <Icon name="search" />
      </button>
    </form>
  );
}
