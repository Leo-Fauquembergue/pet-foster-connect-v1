type BadgeProps = {
  label: string;
  variant?: "default" | "success" | "error" | "neutral";
  className?: string;
};

export default function Badge({ label, variant = "neutral", className = "" }: BadgeProps) {
  const styles = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-success text-white font-bold px-4 py-1",
    error: "bg-error text-white font-bold px-4 py-1",
    neutral: "bg-gray-100 text-gray-800 px-3 py-1",
  };

  return <span className={`rounded-full text-sm ${styles[variant]} ${className}`}>{label}</span>;
}
