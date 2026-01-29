type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  onClick,
  type = "button",
}: ButtonProps) {
  const baseStyles = "px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-sm";

  const variants = {
    primary: "bg-primary text-white hover:bg-orange-600",
    secondary: "bg-secondary text-white hover:bg-green-800",
    outline: "border-2 border-primary text-primary hover:bg-orange-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : "w-auto"}`}
    >
      {children}
    </button>
  );
}
