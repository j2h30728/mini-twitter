import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "phone" | "price";
  register: UseFormRegisterReturn;
  type: string;
  required: boolean;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  type,
  required,
}: InputProps) {
  return (
    <div>
      <label
        className="mb-1 block text-md font-medium text-baseContent"
        htmlFor={name}>
        {label}
      </label>
      <div className="rounded-md relative flex  items-center shadow-sm">
        <input
          id={name}
          {...register}
          type={type}
          required={required}
          className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
  );
}
