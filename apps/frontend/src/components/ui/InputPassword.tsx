import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

type Props = {
  label: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputPassword({ label, error, value, onChange, ...props }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <label className="block mb-1 font-medium">{label}</label>

      <input
        type={show ? "text" : "password"}
        value={value}               // ⚡ important
        onChange={onChange}         // ⚡ important
        className={`border rounded p-2 w-full pr-10 ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
      >
        {show ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
      </button>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
