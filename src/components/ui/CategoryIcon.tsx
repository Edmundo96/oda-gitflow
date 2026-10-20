import { Icon, type IconName } from "@/components/ui/Icon";

const categoryIcons: Record<string, IconName> = {
  Todos: "categoryAll",
  Abarrotes: "categoryGroceries",
  "Lácteos & Huevos": "categoryDairy",
  Bebidas: "categoryDrinks",
  "Frutas & Verduras": "categoryProduce",
  Limpieza: "categoryCleaning",
};

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  return <Icon className={className} name={categoryIcons[category] ?? "tag"} />;
}
