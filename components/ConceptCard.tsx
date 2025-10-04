import { LucideIcon } from "lucide-react";

interface ConceptCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items?: string[];
  color?: string;
}

export default function ConceptCard({ 
  icon: Icon, 
  title, 
  description, 
  items,
  color = "from-blue-500 to-cyan-500"
}: ConceptCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-300">
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} mr-2 mt-2`}></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

