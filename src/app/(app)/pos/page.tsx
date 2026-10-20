"use client";

import { useCallback, useMemo, useState } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CartTable } from "@/components/pos/CartTable";
import { ProductSearch } from "@/components/pos/ProductSearch";
import { Icon } from "@/components/ui/Icon";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

const products: Product[] = [
  {
    id: "tortillas",
    name: "Tortillas de Maíz",
    description: "1 kg",
    barcode: "750100010001",
    category: "Abarrotes",
    price: 22,
    stock: 42,
    minStock: 8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVeQozuRuQmU_GEkKrj9rJ2y9ThssmFLg4Ag_Y6xR8SPTt-ZL5YpaIGrqlDWyTPa5Z3MijTu4qSW3fqlYfBPvincr674yAgxmnBc2aAGcnry4H4lwgCTwMXAEb9_51_ejwPIDK4gk0mtRowa4vICWfOPpaDzFUoCtSgKit30MsNT-a-bsjQqqiRXHNITRKqrjqug_ena__ZbLBzrIlpzCabr1rg65fuH-lTN8NyjR_FwNH_ciYs31G",
  },
  {
    id: "leche",
    name: "Leche Entera",
    description: "1 Litro",
    barcode: "750100011234",
    category: "Lácteos & Huevos",
    price: 27.5,
    stock: 28,
    minStock: 10,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABGJc2JNH4RMH8ULFWzUf64CHo9Jhy12p7Gjg3fiAFWkHWiZ74mdHzxmaRwiWz1Ck2meqcfCIwvUCj3B6QvB1eLOubt0R_eEPjRUl9A5VFJEzLpm4kTAldhjkL72c9KqiP5w9rvZZ_s27CN1Ua8wLvUFVKuqF7kGCnmP8Gk4yZpx3JWURweVf4-_IxiaxbW8Tl16bgGTTutVwlCTSU6w3fk4SyTEZrhnZ1IezgshawdGYevklqchRD",
  },
  {
    id: "huevo",
    name: "Huevo Blanco",
    description: "12 piezas",
    barcode: "750105531984",
    category: "Lácteos & Huevos",
    price: 48,
    stock: 19,
    minStock: 10,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6vpJf2Ko7GVdnlLvbZPHdv_JjSvHLs8f1vDCRL2gpJqjMghAEpkKITB9uDxZqcrwcZgh-kN19f-eI8h2JPRF4YStMDOmElznKGVDBbdrAnof-hR-kJC8UZt55zWIVmR_Grr4PB_w074mx018eOEknppFD4Sxtss47NWsPfHAV1osYhntxbarRmO3vnUdHP-GzrX_9hOnLFqW7inHUpiT2jGo9GFK1ijwRG_hpl6FsoPfz7sb0FjWF",
  },
  {
    id: "coca-cola",
    name: "Coca-Cola",
    description: "600 ml PET",
    barcode: "75007614",
    category: "Bebidas",
    price: 18,
    stock: 50,
    minStock: 12,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA40cOfSzns61jWcdiiEzKkPddhnX5lj_kBPBh2Js3k-PCNf-pGjV6HqAVve_ZamXT7dRz5-LVtvg2pjR2O8SQqPZvszrVDwvC7UQD-Uz3y4t6LhYquqA9AAHeP9ZHw7i8-jGrjmt6peVTv6yVtqCFpMQ5-IrZqBkp8tQFDVfOFdjWw6HQ69Hxbpv86_bktzxx0bvO492wWd_toMA5PIy47WJt6Tor1oANqAvJtkxWMN5cb4QmIsNGN",
  },
  {
    id: "pan",
    name: "Pan Blanco",
    description: "Grande 680 g",
    barcode: "750100020005",
    category: "Abarrotes",
    price: 45,
    stock: 6,
    minStock: 10,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKweyqNwkl6KWu8QguYvW3SeiiTUYCnHZWDydiseiCgj59jWntmd1xly0q05A5G2IVZqOMSFVjz8FypH9_r9Q26HPjg5sEf5Tm8Cc5Y_-YbEtSQlvR2bJAPndWBlrd_H1riL7vdNSUAOXSXXkUB8C7Ne6279CWWkJ9hqICTyR75M77XLl9K7nUfGGzTAcQ4ZiY7eJlrh0QTjDah6Gy6AlKuggE0tSpy4q1q2sJ3ptixfR2Dmzkz3Tj",
  },
  {
    id: "aguacate",
    name: "Aguacate Hass",
    description: "Por kilo (Báscula)",
    barcode: "750100020006",
    category: "Frutas & Verduras",
    price: 65,
    stock: 15,
    minStock: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIh-QrkSIgK_2a2casdXO8swVViZPrYpo1mbplyycKID0X2dWMRKzpbok7kJjjzllXbBeTzsQDHjbYpiyb7VDO98pzVI15BXoNUEyWRrkG7a3KvF-j-PZ5KadTBwGBarzK8n7FGvJ83vQpV3-cisQEI1HWjiwMx5amfS6zLyjvzoQScrzTOc0LtcBReb7kyeWtqwS0pXfe8jSsxFkbCCR2Z9sL8uQPrx0hl-8NRPp6HwftzuOQELCJ",
  },
];

const categories = ["Todos", "Abarrotes", "Lácteos & Huevos", "Bebidas", "Frutas & Verduras"];
const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export default function PosPage() {
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[1], quantity: 2 },
    { product: products[0], quantity: 1 },
    { product: products[2], quantity: 1 },
    { product: products[3], quantity: 2 },
  ]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [toast, setToast] = useState("");

  const addProduct = useCallback((product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      return existing
        ? current.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { product, quantity: 1 }];
    });
    setToast(`${product.name} agregado al ticket`);
    window.setTimeout(() => setToast(""), 1800);
  }, []);

  const addByBarcode = useCallback(
    (barcode: string) => {
      const product = products.find((item) => item.barcode === barcode.trim());
      if (product) {
        addProduct(product);
        setQuery("");
      } else {
        setToast(`No se encontró el código ${barcode}`);
        window.setTimeout(() => setToast(""), 2200);
      }
    },
    [addProduct],
  );

  useBarcodeScanner(addByBarcode);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === "Todos" || product.category === category;
        const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");
        const matchesQuery =
          !normalizedQuery ||
          `${product.name} ${product.description} ${product.barcode}`
            .toLocaleLowerCase("es-MX")
            .includes(normalizedQuery);
        return matchesCategory && matchesQuery;
      }),
    [category, query],
  );

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const quantity = cart.reduce((total, item) => total + item.quantity, 0);
  const tax = subtotal - subtotal / 1.16;

  function updateQuantity(productId: string, nextQuantity: number) {
    setCart((current) =>
      nextQuantity <= 0
        ? current.filter((item) => item.product.id !== productId)
        : current.map((item) =>
            item.product.id === productId ? { ...item, quantity: nextQuantity } : item,
          ),
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-24 text-[#131b2e]">
      <header className="sticky top-0 z-20 border-b border-[#eaedff] bg-[#faf8ff]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803d] text-white">
              <Icon className="text-2xl" name="token" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Ojo de Dios</span>
                <span className="rounded-full bg-[#15803d] px-2 py-0.5 text-xs font-bold text-white">Caja 1</span>
              </div>
              <p className="text-xs text-[#00652c]">● En Línea · 14:32:05</p>
            </div>
          </div>
          <span className="hidden text-sm text-[#6f7a6e] sm:block">María R. · Cajera</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 px-4 py-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section aria-label="Catálogo de productos" className="space-y-4">
          <ProductSearch onScan={addByBarcode} onSearch={setQuery} query={query} />
          <div aria-label="Categorías" className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                aria-pressed={category === item}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category === item
                    ? "bg-[#00652c] text-white"
                    : "bg-[#eaedff] text-[#283044] hover:bg-[#dae2fd]"
                }`}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">⚡ Productos Rápidos</h1>
            <span className="text-xs text-[#6f7a6e]">Toca para agregar</span>
          </div>
          {filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredProducts.map((product) => (
                <button
                  className="overflow-hidden rounded-2xl bg-white p-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  key={product.id}
                  onClick={() => addProduct(product)}
                  type="button"
                >
                  <div
                    aria-label={product.name}
                    className="relative h-24 rounded-xl bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  >
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-[#00652c]">
                      ● {product.stock} disp
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold">{product.name}</p>
                  <p className="truncate text-xs text-[#6f7a6e]">{product.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-[#15803d]">{currency.format(product.price)}</span>
                    <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#95f8a7] text-xl text-[#00210a]">+</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-[#6f7a6e]">
              No hay productos para esta búsqueda.
            </p>
          )}
        </section>

        <section aria-label="Ticket de venta" className="space-y-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="flex items-center justify-between bg-[#f2f3ff] p-4">
              <div>
                <h2 className="font-bold">Ticket #0482</h2>
                <p className="text-xs text-[#6f7a6e]">Cliente General · Contado</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#00652c]/10 px-2 py-1 text-xs font-bold text-[#00652c]">
                  {quantity} {quantity === 1 ? "artículo" : "artículos"}
                </span>
                <button
                  aria-label="Limpiar ticket"
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]"
                  onClick={() => setCart([])}
                  type="button"
                >
                  Limpiar
                </button>
              </div>
            </div>
            <div className="p-4">
              <CartTable
                items={cart}
                onQuantityChange={updateQuantity}
                onRemove={(productId) => updateQuantity(productId, 0)}
              />
            </div>
            <div className="space-y-2 bg-[#eaedff] p-4 text-sm">
              <div className="flex justify-between text-[#3f493f]">
                <span>Subtotal</span><span>{currency.format(subtotal / 1.16)}</span>
              </div>
              <div className="flex justify-between text-[#3f493f]">
                <span>IVA incluido (16%)</span><span>{currency.format(tax)}</span>
              </div>
              <div className="flex items-end justify-between border-t border-[#dae2fd] pt-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide">Total a cobrar</p>
                  <p className="text-xs text-[#00652c]">{quantity} piezas registradas</p>
                </div>
                <p className="text-3xl font-extrabold text-[#00652c]">{currency.format(subtotal)}</p>
              </div>
            </div>
          </div>
          <p className="px-1 text-xs font-semibold text-[#6f7a6e]">💵 Pago rápido en efectivo:</p>
          <div className="grid grid-cols-4 gap-2">
            {[subtotal, 200, 500].map((amount, index) => (
              <button
                className="flex flex-col items-center rounded-xl bg-white px-1 py-3 text-sm shadow-sm hover:bg-[#f2f3ff]"
                key={`${amount}-${index}`}
                onClick={() => setToast(`Efectivo recibido: ${currency.format(amount)}`)}
                type="button"
              >
                <strong className="text-[#00652c]">{index === 0 ? "Exacto" : currency.format(amount)}</strong>
                <span className="text-[10px] text-[#6f7a6e]">
                  {index === 0 ? currency.format(amount) : `Cambio ${currency.format(Math.max(0, amount - subtotal))}`}
                </span>
              </button>
            ))}
            <button
              className="flex flex-col items-center rounded-xl bg-white px-1 py-3 text-sm shadow-sm hover:bg-[#f2f3ff]"
              onClick={() => setToast("Pago con terminal seleccionado")}
              type="button"
            >
              <Icon name="card" />
              <span className="text-[10px]">Terminal</span>
            </button>
          </div>
          <button
            className="flex min-h-16 w-full items-center justify-between rounded-2xl bg-[#15803d] px-4 py-3 text-white shadow-lg transition hover:bg-[#00652c] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!cart.length}
            onClick={() => {
              setToast(`Demostración: ${currency.format(subtotal)}. No se registró ningún pago.`);
            }}
            type="button"
          >
            <span className="flex items-center gap-3 text-left">
              <Icon className="text-3xl" name="pos" />
              <span><strong className="block">COBRAR VENTA</strong><small>F12 o toque para finalizar</small></span>
            </span>
            <strong>{currency.format(subtotal)} →</strong>
          </button>
        </section>
      </main>
      {toast && (
        <div aria-live="polite" className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#283044] px-4 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
      <BottomNavigation active="pos" />
    </div>
  );
}
