"use client";

import Link from "next/link";
import { Cloud, Server, Database, Zap, Shield, ArrowRight, BookOpen, Play, Network } from "lucide-react";

export default function CloudPage() {
  const cloudTopics = [
    {
      icon: Zap,
      title: "Vercel Platform",
      description: "Modern deployment with Vercel, Supabase, and Prisma",
      href: "/cloud/vercel",
      color: "from-black to-gray-700",
      topics: ["Vercel Deployment", "Supabase Database", "Prisma ORM", "Serverless Stack"]
    },
    {
      icon: Server,
      title: "AWS Services",
      description: "Learn core AWS services: EC2, S3, RDS, Lambda, API Gateway",
      href: "/cloud/aws/services",
      color: "from-orange-500 to-red-500",
      topics: ["EC2 & Compute", "S3 Storage", "RDS Databases", "Lambda Functions"]
    },
    {
      icon: Database,
      title: "Migration Strategies",
      description: "Master lift-and-shift, re-platform, and refactor approaches",
      href: "/cloud/aws/strategies",
      color: "from-blue-500 to-cyan-500",
      topics: ["Lift & Shift", "Re-platform", "Refactor", "Hybrid Cloud"]
    },
    {
      icon: Zap,
      title: "Migration Dashboard",
      description: "Interactive tools for planning and executing migrations",
      href: "/cloud/aws/migration",
      color: "from-purple-500 to-pink-500",
      topics: ["Cost Calculator", "Architecture Generator", "Migration Checklist", "Service Selector"]
    },
    {
      icon: Shield,
      title: "Security",
      description: "Essential security practices for API integrations and cloud applications",
      href: "/cloud/security",
      color: "from-red-500 to-orange-500",
      topics: ["Encryption", "Security Headers", "OWASP Top 10", "API Security"]
    }
  ];

  const awsServices = [
    { name: "EC2", category: "Compute", description: "Virtual servers in the cloud" },
    { name: "S3", category: "Storage", description: "Object storage for any amount of data" },
    { name: "RDS", category: "Database", description: "Managed relational database service" },
    { name: "Lambda", category: "Compute", description: "Serverless compute service" },
    { name: "API Gateway", category: "Integration", description: "Managed API service" },
    { name: "CloudWatch", category: "Monitoring", description: "Monitoring and observability" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6">
              <Cloud className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-transparent bg-clip-text">
              Cloud Migration Training
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Master AWS cloud integration and learn how to migrate your applications to the cloud with confidence
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/cloud/aws/migration"
                className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-102 transition-all duration-200"
              >
                Start Migration Guide
              </Link>
              <Link 
                href="/cloud/aws/services"
                className="px-8 py-4 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <Server className="w-4 h-4" />
                Explore AWS Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Cloud Learning Path</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive training on AWS cloud services, migration strategies, and best practices
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {cloudTopics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <Link key={idx} href={topic.href}>
                <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${topic.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {topic.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {topic.topics.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center text-sm text-gray-300">
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${topic.color} mr-2`}></span>
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="text-orange-400 font-semibold flex items-center group-hover:gap-2 transition-all">
                      Explore
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AWS Services Overview */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 border border-slate-600">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key AWS Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {awsServices.map((service, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                    {service.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Get Started</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose your learning path based on your current needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/cloud/aws/services" className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center hover:border-slate-600 transition-all">
            <BookOpen className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Learn AWS Services</h3>
            <p className="text-gray-400 text-sm mb-4">
              Comprehensive guide to AWS core services and their use cases
            </p>
            <span className="text-orange-400 font-semibold flex items-center justify-center gap-2">
              Learn More <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <Link href="/cloud/aws/strategies" className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center hover:border-slate-600 transition-all">
            <Network className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Migration Strategies</h3>
            <p className="text-gray-400 text-sm mb-4">
              Understand different migration approaches and when to use them
            </p>
            <span className="text-blue-400 font-semibold flex items-center justify-center gap-2">
              Explore <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <Link href="/cloud/aws/migration" className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center hover:border-slate-600 transition-all">
            <Play className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Migration Dashboard</h3>
            <p className="text-gray-400 text-sm mb-4">
              Interactive tools for planning and executing your migration
            </p>
            <span className="text-purple-400 font-semibold flex items-center justify-center gap-2">
              Try Tools <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

