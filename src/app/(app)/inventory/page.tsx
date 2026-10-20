"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Toast } from "@/components/ui/Toast";
import { products as initialProducts } from "@/data/products";
import { useToast } from "@/hooks/useToast";
import { compactCurrency, normalizeSearch } from "@/lib/format";
import { getStockStatus, type StockStatus } from "@/lib/stock";

type InventoryFilter = "Todos" | "Bajo Stock" | "Agotados";

const filters: Record<InventoryFilter, { status: StockStatus | null; icon: IconName }> = {
  Todos: { status: null, icon: "list" },
  "Bajo Stock": { status: "low", icon: "alert" },
  Agotados: { status: "out", icon: "packageOut" },
};

export default function InventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InventoryFilter>("Todos");
  const { message: toast, showToast } = useToast();

  const { lowCount, outCount, valuation } = useMemo(
    () =>
      products.reduce(
        (summary, product) => {
          const status = getStockStatus(product);
          if (status === "low") summary.lowCount += 1;
          if (status === "out") summary.outCount += 1;
          summary.valuation += product.price * product.stock;
          return summary;
        },
        { lowCount: 0, outCount: 0, valuation: 0 },
      ),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    const { status } = filters[filter];
    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        normalizeSearch(`${product.name} ${product.id} ${product.barcode}`).includes(normalizedQuery);
      return matchesQuery && (!status || getStockStatus(product) === status);
    });
  }, [filter, products, query]);

  const filterCounts: Record<InventoryFilter, number> = {
    Todos: products.length,
    "Bajo Stock": lowCount,
    Agotados: outCount,
  };

  return (
    <div className="min-h-dvh bg-[#faf8ff] pb-nav text-[#131b2e]">
      <AppHeader subtitle="Inventario" />
      <main className="mx-auto max-w-7xl space-y-4 py-4 px-safe">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f2f3ff] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#00652c] shadow-sm">
              <Icon className="text-xl" name="clipboard" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">Gestor de Existencias</h1>
              <p className="text-xs text-[#6f7a6e]">Auditoría de anaquel activa</p>
            </div>
          </div>
          <button
            className="flex min-h-11 shrink-0 items-center gap-1 rounded-xl bg-[#00652c] px-3 text-sm font-semibold text-white transition hover:bg-[#15803d]"
            onClick={() => showToast("Conecta el formulario de alta para crear productos.", { durationMs: 2500 })}
            type="button"
          >
            <Icon className="text-xl" name="add" />
            <span className="hidden sm:inline">Nuevo Producto</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>
        {/* En teléfonos angostos: 2 columnas y la valuación ocupa la fila completa. */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs text-[#6f7a6e]">
              <Icon className="text-sm" name="package" /> Catálogo Total
            </p>
            <p className="mt-1 text-xl font-extrabold">{products.length}</p>
            <p className="text-xs text-[#6f7a6e]">artículos activos</p>
          </div>
          <div className="rounded-xl bg-[#ffdad6] p-3 text-[#ba1a1a] shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Icon className="text-sm" name="alert" /> Stock Bajo
            </p>
            <p className="mt-1 text-xl font-extrabold">{lowCount + outCount}</p>
            <p className="text-xs">por reordenar</p>
          </div>
          <div className="col-span-2 rounded-xl bg-white p-3 shadow-sm sm:col-span-1">
            <p className="flex items-center gap-1.5 text-xs text-[#6f7a6e]">
              <Icon className="text-sm" name="money" /> Valuación
            </p>
            <p className="mt-1 truncate text-xl font-extrabold">{compactCurrency.format(valuation)}</p>
            <p className="text-xs text-[#6f7a6e]">valor a precio venta</p>
          </div>
        </div>
        <label className="flex h-12 items-center gap-2 rounded-xl bg-white pl-3 pr-1 shadow-sm focus-within:ring-2 focus-within:ring-[#15803d]">
          <Icon className="text-xl text-[#6f7a6e]" name="search" />
          {/* text-base (16px): con menos, iOS Safari hace zoom al enfocar el campo. */}
          <input
            aria-label="Buscar productos en inventario"
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-sm"
            enterKeyHint="search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, código o SKU..."
            value={query}
          />
          {query && (
            <button
              aria-label="Limpiar búsqueda"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-[#eaedff]"
              onClick={() => setQuery("")}
              type="button"
            >
              <Icon className="text-xl text-[#6f7a6e]" name="close" />
            </button>
          )}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(filters) as InventoryFilter[]).map((item) => (
            <button
              aria-pressed={filter === item}
              className={`flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold ${
                filter === item
                  ? "bg-[#00652c] text-white"
                  : item === "Bajo Stock"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : "bg-[#eaedff] text-[#3f493f]"
              }`}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              <Icon className="text-sm" name={filters[item].icon} />
              {item} ({filterCounts[item]})
            </button>
          ))}
        </div>
        <InventoryTable
          onEdit={(product) =>
            showToast(`Edición de ${product.name}: conecta el formulario de producto.`, { durationMs: 2500 })
          }
          onStockChange={(productId, stock) =>
            setProducts((current) =>
              current.map((product) => product.id === productId ? { ...product, stock } : product),
            )
          }
          products={visibleProducts}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f2f3ff] p-3 text-xs text-[#3f493f]">
          <p>Mostrando {visibleProducts.length} de {products.length} productos</p>
          <p className="flex items-center gap-1.5 font-semibold text-[#00652c]">
            <Icon className="text-sm" name="sync" /> Sincronizado con Báscula y Terminal 1
          </p>
        </div>
      </main>
      <Toast message={toast} />
      <BottomNavigation active="inventory" />
    </div>
  );
}
