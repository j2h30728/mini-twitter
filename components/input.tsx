import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label?: string;
  name: string;
  kind?: "text" | "textarea";
  register: UseFormRegisterReturn;
  type?: string;
  required: boolean;
  placeholder?: string;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  type,
  required,
  placeholder,
}: InputProps) {
  return (
    <div className="h-full">
      <label
        className="mb-1 block text-md font-medium text-baseContent"
        htmlFor={name}>
        {label}
      </label>
      <div className="rounded-md relative flex h-full items-center shadow-sm">
        {kind === "text" ? (
          <input
            id={name}
            {...register}
            type={type}
            required={required}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-point focus:border-point"
            placeholder={placeholder}
          />
        ) : (
          <textarea
            id={name}
            {...register}
            className="appearance-none mt-1 resize-none  shadow-sm w-full h-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-point focus:border-point"
            rows={4}
            required
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
