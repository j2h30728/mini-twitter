import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "textarea";
  register: UseFormRegisterReturn;
  type?: string;
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
        {kind === "text" ? (
          <input
            id={name}
            {...register}
            type={type}
            required={required}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-point focus:border-point"
          />
        ) : (
          <textarea
            id={name}
            {...register}
            className="mt-1 shadow-sm w-full h-full focus:ring-point rounded-md border-gray-300 focus:border-point"
            rows={4}
          />
        )}
      </div>
    </div>
  );
}
