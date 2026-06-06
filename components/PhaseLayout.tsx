import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface PhaseLayoutProps {
  phaseNumber: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children: ReactNode;
  breadcrumbs?: { label: string; href: string }[];
}

export default function PhaseLayout({
  phaseNumber,
  title,
  description,
  icon: Icon,
  color,
  children,
  breadcrumbs,
}: PhaseLayoutProps) {
  // Default breadcrumbs if not provided
  const defaultBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Start", href: "/start" },
  ];

  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${color} py-10 sm:py-16`}>
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6 overflow-x-auto text-sm">
            <div className="flex min-w-max items-center gap-2 whitespace-nowrap">
            {finalBreadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2 shrink-0">
                {index === 0 && <Home className="w-4 h-4 text-white/70" />}
                <Link
                  href={crumb.href}
                  className="text-white/70 hover:text-white transition-colors font-medium"
                >
                  {crumb.label}
                </Link>
                {index < finalBreadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
                )}
              </div>
            ))}
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <span className="text-white font-semibold shrink-0">{title}</span>
            </div>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl shrink-0 self-start">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{`Phase ${phaseNumber}: ${title}`}</h1>
            </div>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl">{description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </div>
    </div>
  );
}
