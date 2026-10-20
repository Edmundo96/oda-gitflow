import type { InputHTMLAttributes } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "className"> {
  id: string;
  label: string;
  icon: IconName;
  onChange: (value: string) => void;
}

/** Campo de texto con etiqueta e icono, a 16px para que iOS no haga zoom. */
export function TextField({ id, label, icon, onChange, ...input }: TextFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#3f493f]" htmlFor={id}>
        {label}
      </label>
      <div className="flex h-12 items-center gap-3 rounded-xl bg-[#f2f3ff] px-4 focus-within:ring-2 focus-within:ring-[#15803d]">
        <Icon className="text-lg text-[#6f7a6e]" name={icon} />
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-base outline-none"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          {...input}
        />
      </div>
    </div>
  );
}
