import { CheckCircle2, Circle } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  requirements: string[];
  status?: "not-started" | "in-progress" | "completed";
}

export default function ProjectCard({ 
  title, 
  description, 
  requirements,
  status = "not-started" 
}: ProjectCardProps) {
  const statusColors = {
    "not-started": "border-slate-700",
    "in-progress": "border-yellow-500/50 bg-yellow-500/5",
    "completed": "border-green-500/50 bg-green-500/5"
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${statusColors[status]} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {status === "completed" && (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        )}
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="space-y-3">
        <h4 className="font-semibold text-white text-sm">Requirements:</h4>
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-start gap-3 text-gray-300">
            <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{req}</span>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all">
        {status === "completed" ? "View Project" : status === "in-progress" ? "Continue" : "Start Project"}
      </button>
    </div>
  );
}

