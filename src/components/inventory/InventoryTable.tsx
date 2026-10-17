"use client";

import type { Product } from "@/types/product";
import { Icon } from "@/components/ui/Icon";

interface InventoryTableProps {
  products: Product[];
  onStockChange: (productId: string, stock: number) => void;
}

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function InventoryTable({ products, onStockChange }: InventoryTableProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-sm text-[#6f7a6e]">
        No se encontraron productos.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const lowStock = product.stock <= product.minStock;

        return (
          <article className="rounded-2xl bg-white p-3 shadow-sm" key={product.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  aria-label={product.name}
                  className="h-14 w-14 shrink-0 rounded-xl bg-cover bg-center"
                  role="img"
                  style={{ backgroundImage: `url("${product.image}")` }}
                />
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{product.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6f7a6e]">
                    <span>#{product.barcode}</span>
                    <span className="rounded bg-[#eaedff] px-1.5 py-0.5">{product.category}</span>
                  </div>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                  lowStock
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : "bg-[#95f8a7] text-[#00652c]"
                }`}
              >
                {lowStock ? "Bajo Stock" : "En Stock"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-[#f2f3ff] px-3 py-2">
              <div>
                <p className="text-xs text-[#6f7a6e]">Precio Venta</p>
                <p className="text-lg font-extrabold">{currency.format(product.price)}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${lowStock ? "text-[#ba1a1a]" : "text-[#6f7a6e]"}`}>
                  {lowStock ? `Mínimo: ${product.minStock}` : "Disponible"}
                </p>
                <p className={`font-bold ${lowStock ? "text-[#ba1a1a]" : "text-[#00652c]"}`}>
                  {product.stock} uds
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-white p-0.5">
                <button
                  aria-label={`Restar stock de ${product.name}`}
                  className="h-9 w-9 rounded-md text-lg hover:bg-[#eaedff]"
                  onClick={() => onStockChange(product.id, Math.max(0, product.stock - 1))}
                  type="button"
                >
                  −
                </button>
                <button
                  aria-label={`Sumar stock de ${product.name}`}
                  className="h-9 w-9 rounded-md text-lg font-semibold text-[#00652c] hover:bg-[#eaedff]"
                  onClick={() => onStockChange(product.id, product.stock + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
              <button
                aria-label={`Editar ${product.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaedff] text-[#3f493f]"
                onClick={() => window.alert(`Edición de ${product.name}: conecta el formulario de producto.`)}
                type="button"
              >
                <Icon name="edit" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
