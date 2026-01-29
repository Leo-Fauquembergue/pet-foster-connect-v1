type CompatibilityBadgeProps = {
  label: string;
  isCompatible: boolean;
};

export default function CompatibilityBadge({ label, isCompatible }: CompatibilityBadgeProps) {
  return (
    <span
      className={`px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm
      ${isCompatible ? "bg-success" : "bg-error"}`}
    >
      {label}
    </span>
  );
}
