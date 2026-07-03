"use client";

import Link from "next/link";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { Brain, Heart, FileText, Sparkles, ArrowRight, Home, Zap, Target, BookOpen, Code, Lightbulb } from "lucide-react";

export default function AIPage() {
  const coreComponents = [
    {
      icon: Heart,
      title: "Heart",
      subtitle: "Emotions, Ethics & Human-Centered Design",
      color: "from-pink-500 to-rose-500",
      description: "The emotional and ethical foundation of AI. Understanding human needs, values, and the impact of AI on society.",
      keyAreas: [
        "Ethical AI development",
        "User empathy and experience",
        "Bias detection and mitigation",
        "Human-AI collaboration",
        "Privacy and data protection",
        "Accessibility and inclusion"
      ],
      learningFocus: [
        "Understanding user needs and emotions",
        "Building trust with AI systems",
        "Designing for human well-being",
        "Ethical decision-making frameworks",
        "Responsible AI practices"
      ]
    },
    {
      icon: Brain,
      title: "Brain",
      subtitle: "Intelligence, Reasoning & Learning",
      color: "from-blue-500 to-indigo-500",
      description: "The cognitive engine of AI. How machines learn, reason, and make decisions through algorithms and neural networks.",
      keyAreas: [
        "Machine learning algorithms",
        "Neural networks and deep learning",
        "Natural language processing",
        "Computer vision",
        "Reinforcement learning",
        "Transfer learning"
      ],
      learningFocus: [
        "Understanding AI models and architectures",
        "Training and fine-tuning models",
        "Model evaluation and metrics",
        "Optimization techniques",
        "AI research and innovation"
      ]
    },
    {
      icon: FileText,
      title: "Context",
      subtitle: "Understanding, Environment & Data",
      color: "from-purple-500 to-violet-500",
      description: "The environment and data that shape AI understanding. Context enables AI to make relevant and accurate decisions.",
      keyAreas: [
        "Data collection and preprocessing",
        "Contextual understanding",
        "Domain knowledge integration",
        "Temporal and spatial context",
        "Multi-modal data processing",
        "Context-aware systems"
      ],
      learningFocus: [
        "Data quality and preparation",
        "Context extraction and representation",
        "Understanding domain-specific contexts",
        "Handling missing or incomplete data",
        "Context preservation in AI systems"
      ]
    },
    {
      icon: Sparkles,
      title: "Instructions",
      subtitle: "Prompts, Guidance & Commands",
      color: "from-amber-500 to-orange-500",
      description: "How we communicate with AI. Effective instructions, prompts, and guidance that unlock AI capabilities.",
      keyAreas: [
        "Prompt engineering",
        "Instruction design",
        "Few-shot and zero-shot learning",
        "Chain-of-thought prompting",
        "System prompts and role definition",
        "Instruction fine-tuning"
      ],
      learningFocus: [
        "Writing effective prompts",
        "Structuring instructions for clarity",
        "Advanced prompting techniques",
        "Optimizing AI responses",
        "Instruction optimization strategies"
      ]
    }
  ];

  const learningPaths = [
    {
      title: "AI Fundamentals",
      description: "Start with the basics of AI, machine learning, and how AI systems work",
      icon: BookOpen,
      href: "/ai/fundamentals",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "AI Components Deep Dive",
      description: "Explore each component in detail: Heart, Brain, Context, and Instructions",
      icon: Target,
      href: "/ai/components",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Practical Applications",
      description: "Learn how to build real-world AI applications using all components",
      icon: Zap,
      href: "/ai/applications",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "AI Integration",
      description: "Integrate AI into your existing applications and workflows",
      icon: Code,
      href: "/ai/integration",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <SubscriptionGate phaseNumber="ai" lockedContentName="AI Learning Section">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 py-16">
          <div className="container mx-auto px-6">
            <nav className="flex items-center gap-2 mb-6 text-sm">
              <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <span className="text-white/50">/</span>
              <span className="text-white font-semibold">AI Learning</span>
            </nav>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AI Learning Section</h1>
                <p className="text-xl text-white/90 mt-2">Master AI through its core components: Heart, Brain, Context, and Instructions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Goal Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">🎯 Learning Goal</h2>
            <p className="text-gray-300 text-lg">
              Understand AI through its four core components. Learn how Heart (ethics), Brain (intelligence), Context (understanding), and Instructions (guidance) work together to create effective AI systems. Master the 20% of concepts that cover 80% of practical AI applications.
            </p>
          </div>

          {/* Core Components Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">The 4 Core Components of AI</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Every AI system is built on these four fundamental components. Understanding how they work together is key to mastering AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {coreComponents.map((component) => {
                const Icon = component.icon;
                return (
                  <div
                    key={component.title}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${component.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{component.title}</h3>
                        <p className="text-gray-400 text-sm">{component.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{component.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Key Areas:</h4>
                        <ul className="space-y-1">
                          {component.keyAreas.map((area, idx) => (
                            <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${component.color}`}></span>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">Learning Focus:</h4>
                        <ul className="space-y-1">
                          {component.learningFocus.map((focus, idx) => (
                            <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                              <Lightbulb className="w-3 h-3 text-amber-400" />
                              {focus}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Learning Paths */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Learning Paths</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {learningPaths.map((path) => {
                const PathIcon = path.icon;
                return (
                  <Link
                    key={path.title}
                    href={path.href}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${path.color}`}>
                        <PathIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                          {path.title}
                        </h3>
                        <p className="text-gray-400 mb-4">{path.description}</p>
                        <div className="flex items-center gap-2 text-purple-400 font-semibold">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* How Components Work Together */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-8 border border-slate-600">
              <h2 className="text-3xl font-bold text-white mb-6">How Components Work Together</h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg">
                  AI systems are most effective when all four components work in harmony:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">💡 Example: AI Assistant</h4>
                    <ul className="text-sm space-y-1 text-gray-400">
                      <li><strong className="text-pink-400">Heart:</strong> Understands user emotions, respects privacy</li>
                      <li><strong className="text-blue-400">Brain:</strong> Processes language, generates responses</li>
                      <li><strong className="text-purple-400">Context:</strong> Remembers conversation history, user preferences</li>
                      <li><strong className="text-amber-400">Instructions:</strong> Follows system prompts, user commands</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">💡 Example: AI Code Generator</h4>
                    <ul className="text-sm space-y-1 text-gray-400">
                      <li><strong className="text-pink-400">Heart:</strong> Generates ethical, secure code</li>
                      <li><strong className="text-blue-400">Brain:</strong> Understands programming patterns</li>
                      <li><strong className="text-purple-400">Context:</strong> Uses project context, codebase knowledge</li>
                      <li><strong className="text-amber-400">Instructions:</strong> Follows coding standards, user requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-3">🚀 Quick Start</h3>
              <p className="text-gray-300 mb-4">
                New to AI? Start with the fundamentals to understand how AI works, then dive into each component. 
                Already familiar? Jump to practical applications to see how components integrate in real systems.
              </p>
              <Link
                href="/ai/components"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Explore AI Components
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </SubscriptionGate>
  );
}


