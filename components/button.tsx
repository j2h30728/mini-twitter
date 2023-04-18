import { cls } from "@/lib/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  disabled?: boolean;
  [key: string]: any;
}

export default function Button({
  large = false,
  disabled = false,
  onClick,
  text,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      {...rest}
      className={cls(
        "w-full bg-primary hover:bg-primaryFocus active:bg-point text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-point focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-sm "
      )}>
      {text}
    </button>
  );
}
