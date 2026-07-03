"use client";

import { useState } from "react";
import { Server, Database, Zap, Network, BarChart3 } from "lucide-react";

interface AwsService {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
}

const services: AwsService[] = [
  { id: "ec2", name: "EC2", category: "Compute", description: "Virtual servers", icon: Server },
  { id: "s3", name: "S3", category: "Storage", description: "Object storage", icon: Database },
  { id: "rds", name: "RDS", category: "Database", description: "Managed databases", icon: Database },
  { id: "lambda", name: "Lambda", category: "Compute", description: "Serverless functions", icon: Zap },
  { id: "api-gateway", name: "API Gateway", category: "Integration", description: "API management", icon: Network },
  { id: "cloudwatch", name: "CloudWatch", category: "Monitoring", description: "Monitoring service", icon: BarChart3 },
];

export default function AwsServiceSelector() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredServices = filter === "all"
    ? services
    : services.filter(s => s.category.toLowerCase() === filter.toLowerCase());

  const categories = ["all", ...Array.from(new Set(services.map(s => s.category)))];

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === cat
                ? "bg-purple-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedServices.includes(service.id);
          return (
            <button
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-6 h-6 ${isSelected ? "text-purple-400" : "text-gray-400"}`} />
                <div>
                  <h4 className="font-bold text-white">{service.name}</h4>
                  <span className="text-xs text-gray-400">{service.category}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300">{service.description}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h4 className="text-white font-semibold mb-2">Selected Services ({selectedServices.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((id) => {
              const service = services.find(s => s.id === id);
              return service ? (
                <span key={id} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  {service.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

