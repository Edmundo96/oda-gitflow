"use client";

import { useMemo, useState } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/types/product";

const initialProducts: Product[] = [
  { id: "leche", name: "Leche Entera 1L Lala", description: "1 Litro", barcode: "750100011234", category: "Lácteos", price: 27.5, stock: 42, minStock: 12, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfO2czvqaBo4Fzu1OVjrQeweyLM342fOusbJA3veQZrvYfUdg5MTL6xz8Zm5J1qY7X5lXGpGJ6gXbk_55uvuabCYbDMBJlxv0mkVStjrWK0Zfyqv8oG2qitnYuPikfBfXvxUM_9r3PhuW6eFAtgvD9nZpo3uG8sLAFH6ngX2ChjLYmQY8xQnjGz94Mo4ZGUmUPQ8JwUc1hnbymb8EjLAE2lybazMcBlPssH7M2npJUNBdLY5pi5kB5" },
  { id: "aceite", name: "Aceite Vegetal 1L 1-2-3", description: "1 Litro", barcode: "750103045612", category: "Abarrotes", price: 42, stock: 4, minStock: 12, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMOZxQ6inRyAACKJ7u-ON8db6fXk2_sREg4jcocPjF8_ibrAy-Y9oUE41GrgVHXpCc5O-uP6RsQo3OH18-Spmv9L8nZU-Q07IuwMbz2BIHnkt1AoVPIPqh6oLtZT-LMKzV5T5GYv2sQK17uebRdC86ipkFXbOJmP3DEsMZvYdiO5pHrCQ382r0TpkFmJuZdHlCazKcqe2X2Un0AJJBSF4LksU5CvQ3ERuHnmDek-J7RqNdbYnUjNNr" },
  { id: "huevo", name: "Huevo Blanco Paquete 12", description: "12 piezas", barcode: "750105531984", category: "Abarrotes", price: 48, stock: 6, minStock: 15, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7z5Uy0T0-fAcpOiObSEbeTn5QktR98bty2Q5j-nHernAJv5KfOBzJJkqQBi-Cf5rSwcsYiMiIMTeN73ZyUfNzOFCRLvYEyYa-Qm2RhccWErMf-rbWyqHI3K6dexsf_doqhjTCnGm8GxwyWDh7Kc_3w4CShCPz2zc522gG6cc7FL6NNYV8-Mcv3EHmjKpPYPCb4JjCdp4w_voCUYfTh4DTjX-TJgoBMxNQWpA6zBY3srq2VyjuKdkn" },
  { id: "coca-cola", name: "Coca-Cola Original 600ml", description: "600 ml", barcode: "75007614", category: "Bebidas", price: 18, stock: 85, minStock: 20, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqF65H3F1EIFg1bkVnQ9g1grRcShnDORGR4p4UAq5jocwgTHWjHErU9-NBNhcnTlDLqUmYIt2cVcCYiqNHchQXS1A3If5MGTIM8qyr7zpodIvT6M-Uzq9BaSt3zM3ldjBO0jdjFqke40Q-Ct1LJafuPL9dVzMPRS-Htp_SZDrXJp1xwvjONIiGftw0yyLaqmOj1iQ4aMVeqmJl0-wLO_R8kmReZPK06uLp3PA-GGym0yUxH35A8xRx" },
  { id: "frijol", name: "Frijol Negro 1kg La Costeña", description: "1 kg", barcode: "750100015521", category: "Abarrotes", price: 36, stock: 18, minStock: 8, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCU2CCAQyPoGIO9bRVEPDOzHkrMmekekysnlbF28MTLs5TS_SGgE4YVqkvwfUvDoksIVIgFEToazHXn2OXRpMUzUxN79kcb9sm5CgnhI2w4FduqxBJl7Dv8Nid_q01ZdoecIp42I_ywddUN_QJO9bet5QxWfVxlKtkAkJrC3NvqDlOoycodZ1XwJjOxtYY2TJOfediPV0awfImhHh-eDH9ukbaPbf07t_4X3y3DRSF4o2igCPGPQabQ" },
  { id: "jabon", name: "Jabón Zote Rosa 400g", description: "400 g", barcode: "750102058890", category: "Limpieza", price: 21.5, stock: 2, minStock: 10, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs8hd0bTdRMG-YRjZ1qNszmQT7CpekXHbcCt2wnbL8OJLUsFleC42yUuD-oNKR5917MWOKSrPHPat0S3jneWreV24-H30xjqTBa9og_kx3PnmPv-TV-XxjABmmKWD5xUho6L2HBfLdEWwDUT6sJx7G8ooa-rQPaX8UYJfeRH77suOU4-mz93ComZ3_JnEWQS_vwiZoV0riHlnZUQe7PfH9PLtJRutmYHfELoI25jcnUPla6GZcCUBx" },
];

type InventoryFilter = "Todos" | "Bajo Stock" | "Agotados";

export default function InventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InventoryFilter>("Todos");
  const lowStockCount = products.filter((product) => product.stock <= product.minStock).length;
  const valuation = products.reduce((total, product) => total + product.price * product.stock, 0);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.barcode}`
          .toLocaleLowerCase("es-MX")
          .includes(query.trim().toLocaleLowerCase("es-MX"));
        const matchesFilter =
          filter === "Todos" ||
          (filter === "Bajo Stock" && product.stock > 0 && product.stock <= product.minStock) ||
          (filter === "Agotados" && product.stock === 0);
        return matchesQuery && matchesFilter;
      }),
    [filter, products, query],
  );

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-24 text-[#131b2e]">
      <header className="sticky top-0 z-20 border-b border-[#eaedff] bg-[#faf8ff]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803d] text-white">
            <Icon className="text-2xl" name="token" />
          </div>
          <div>
            <p className="font-semibold">Ojo de Dios <span className="rounded-full bg-[#15803d] px-2 py-0.5 text-xs text-white">Caja 1</span></p>
            <p className="text-xs text-[#00652c]">● En Línea · Inventario</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f2f3ff] p-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Gestor de Existencias</h1>
            <p className="text-xs text-[#6f7a6e]">Auditoría de anaquel activa</p>
          </div>
          <button
            className="flex min-h-11 shrink-0 items-center gap-1 rounded-xl bg-[#00652c] px-3 text-sm font-semibold text-white"
            onClick={() => window.alert("Conecta el formulario de alta para crear productos.")}
            type="button"
          >
            <Icon className="text-xl" name="add" />
            <span className="hidden sm:inline">Nuevo Producto</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <p className="text-xs text-[#6f7a6e]">Catálogo Total</p>
            <p className="mt-1 text-xl font-extrabold">{products.length}</p>
            <p className="text-xs text-[#6f7a6e]">artículos activos</p>
          </div>
          <div className="rounded-xl bg-[#ffdad6] p-3 text-[#ba1a1a] shadow-sm">
            <p className="text-xs font-semibold">Stock Bajo</p>
            <p className="mt-1 text-xl font-extrabold">{lowStockCount}</p>
            <p className="text-xs">por reordenar</p>
          </div>
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <p className="text-xs text-[#6f7a6e]">Valuación</p>
            <p className="mt-1 truncate text-lg font-extrabold">
              {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", notation: "compact" }).format(valuation)}
            </p>
            <p className="text-xs text-[#6f7a6e]">valor a precio venta</p>
          </div>
        </div>
        <label className="flex h-12 items-center gap-2 rounded-xl bg-white px-3 shadow-sm">
          <Icon className="text-xl text-[#6f7a6e]" name="search" />
          <input
            aria-label="Buscar productos en inventario"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, código de barras o SKU..."
            value={query}
          />
          {query && (
            <button aria-label="Limpiar búsqueda" onClick={() => setQuery("")} type="button">
              <Icon className="text-xl text-[#6f7a6e]" name="close" />
            </button>
          )}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["Todos", "Bajo Stock", "Agotados"] as const).map((item) => (
            <button
              aria-pressed={filter === item}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
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
              {item === "Todos" ? `Todos (${products.length})` : item === "Bajo Stock" ? `● ${item} (${lowStockCount})` : `Agotados (${products.filter((product) => product.stock === 0).length})`}
            </button>
          ))}
        </div>
        <InventoryTable
          onStockChange={(productId, stock) =>
            setProducts((current) =>
              current.map((product) => product.id === productId ? { ...product, stock } : product),
            )
          }
          products={visibleProducts}
        />
        <div className="rounded-xl bg-[#f2f3ff] p-3 text-xs text-[#3f493f]">
          <p>Mostrando {visibleProducts.length} de {products.length} productos</p>
          <p className="mt-2 font-semibold text-[#00652c]">☁ Sincronizado con Báscula y Terminal 1</p>
        </div>
      </main>
      <BottomNavigation active="inventory" />
    </div>
  );
}
