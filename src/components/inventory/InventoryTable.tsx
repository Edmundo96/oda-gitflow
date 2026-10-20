"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Icon, type IconName } from "@/components/ui/Icon";
import { currency } from "@/lib/format";
import { getStockStatus, type StockStatus } from "@/lib/stock";

interface InventoryTableProps {
  products: Product[];
  onStockChange: (productId: string, stock: number) => void;
  onEdit: (product: Product) => void;
}

const statusBadge: Record<StockStatus, { label: string; icon: IconName; className: string }> = {
  out: { label: "Agotado", icon: "packageOut", className: "bg-[#ba1a1a] text-white" },
  low: { label: "Bajo Stock", icon: "alert", className: "bg-[#ffdad6] text-[#ba1a1a]" },
  ok: { label: "En Stock", icon: "packageOk", className: "bg-[#95f8a7] text-[#00652c]" },
};

export function InventoryTable({ products, onStockChange, onEdit }: InventoryTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-8 text-center text-sm text-[#6f7a6e]">
        <Icon className="text-3xl" name="notFound" />
        <p>No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const status = getStockStatus(product);
        const badge = statusBadge[status];
        const needsRestock = status !== "ok";

        return (
          <article className="flex min-w-0 flex-col rounded-2xl bg-white p-3 shadow-sm" key={product.id}>
            {/* flex-1: en la cuadrícula las tarjetas miden igual y los controles quedan alineados abajo. */}
            <div className="flex flex-1 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl bg-[#eaedff] object-cover"
                  height={56}
                  src={product.image}
                  width={56}
                />
                <div className="min-w-0">
                  <h2 className="line-clamp-2 font-semibold leading-snug">{product.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6f7a6e]">
                    <span className="flex items-center gap-1">
                      <Icon name="barcode" /> {product.barcode}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap rounded bg-[#eaedff] px-1.5 py-0.5">
                      <CategoryIcon category={product.category} /> {product.category}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${badge.className}`}>
                <Icon name={badge.icon} /> {badge.label}
              </span>
            </div>
            {/* flex-wrap + ml-auto: en pantallas angostas los botones bajan a su propia fila alineados a la derecha. */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-[#f2f3ff] px-3 py-2">
              <div>
                <p className="text-xs text-[#6f7a6e]">Precio Venta</p>
                <p className="text-lg font-extrabold">{currency.format(product.price)}</p>
              </div>
              <div>
                <p className={`text-xs ${needsRestock ? "text-[#ba1a1a]" : "text-[#6f7a6e]"}`}>
                  {needsRestock ? `Mínimo: ${product.minStock}` : "Disponible"}
                </p>
                <p className={`font-bold ${needsRestock ? "text-[#ba1a1a]" : "text-[#00652c]"}`}>
                  {product.stock} uds
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg bg-white p-0.5">
                  <button
                    aria-label={`Restar stock de ${product.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-[#eaedff] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    disabled={product.stock <= 0}
                    onClick={() => onStockChange(product.id, product.stock - 1)}
                    type="button"
                  >
                    <Icon name="minus" />
                  </button>
                  <button
                    aria-label={`Sumar stock de ${product.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-md text-[#00652c] hover:bg-[#eaedff]"
                    onClick={() => onStockChange(product.id, product.stock + 1)}
                    type="button"
                  >
                    <Icon name="add" />
                  </button>
                </div>
                <button
                  aria-label={`Editar ${product.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaedff] text-[#3f493f] hover:bg-[#dae2fd]"
                  onClick={() => onEdit(product)}
                  type="button"
                >
                  <Icon name="edit" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
