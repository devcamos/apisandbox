import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PhaseLayoutProps {
  phaseNumber: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children: ReactNode;
}

export default function PhaseLayout({
  phaseNumber,
  title,
  description,
  icon: Icon,
  color,
  children,
}: PhaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${color} py-16`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-white/80 font-semibold mb-1">Phase {phaseNumber}</div>
              <h1 className="text-4xl font-bold text-white">{title}</h1>
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">{description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {children}
      </div>
    </div>
  );
}

