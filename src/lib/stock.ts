import type { Product } from "@/types/product";

export type StockStatus = "out" | "low" | "ok";

export function getStockStatus({ stock, minStock }: Pick<Product, "stock" | "minStock">): StockStatus {
  if (stock <= 0) return "out";
  return stock <= minStock ? "low" : "ok";
}
