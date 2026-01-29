import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type BackBannerProps = {
  to: string;
  label?: string;
};

export default function BackBanner({ to, label = "Retour" }: BackBannerProps) {
  return (
    <div className="w-full bg-gray-200 py-3 px-4">
      <div className="container mx-auto flex items-center justify-start">
        <Link
          to={to}
          className="inline-flex items-center gap-2 px-4 py-1 border border-gray-500 rounded text-gray-700 hover:bg-gray-300 transition text-sm font-medium bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          {label}
        </Link>
      </div>
    </div>
  );
}
