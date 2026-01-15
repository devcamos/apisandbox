"use client";

import ConceptCard from "@/components/ConceptCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import Link from "next/link";
import { Heart, Brain, FileText, Sparkles, Home, Lightbulb, Target, Zap } from "lucide-react";

export default function AIComponentsPage() {
  return (
    <SubscriptionGate phaseNumber="ai" lockedContentName="AI Components Deep Dive">
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
              <Link href="/ai" className="text-white/70 hover:text-white transition-colors">AI</Link>
              <span className="text-white/50">/</span>
              <span className="text-white font-semibold">Components</span>
            </nav>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AI Components Deep Dive</h1>
                <p className="text-xl text-white/90 mt-2">Comprehensive guide to Heart, Brain, Context, and Instructions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Goal Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">🎯 Learning Goal</h2>
            <p className="text-gray-300 text-lg">
              Master each of the four core AI components. Understand how Heart (ethics), Brain (intelligence), Context (understanding), and Instructions (guidance) work individually and together to create effective AI systems.
            </p>
          </div>

          {/* AI Components */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">The 4 Core Components</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Heart Component */}
              <ConceptCard
                icon={Heart}
                title="Heart: Ethics & Human-Centered Design"
                description="The emotional and ethical foundation of AI systems"
                items={[
                  "Ethical AI development principles",
                  "Bias detection and mitigation",
                  "User empathy and experience design",
                  "Privacy and data protection",
                  "Human-AI collaboration patterns",
                  "Accessibility and inclusion"
                ]}
                color="from-pink-500 to-rose-500"
                documentation={{
                  overview: "The Heart component represents the ethical, emotional, and human-centered aspects of AI. It ensures AI systems are built with empathy, fairness, and respect for human values.",
                  description: [
                    "Ethical frameworks for AI development (fairness, accountability, transparency)",
                    "Bias detection techniques and mitigation strategies",
                    "User-centered design principles for AI interfaces",
                    "Privacy-preserving AI techniques",
                    "Human-AI collaboration patterns and trust-building",
                    "Accessibility considerations for AI systems",
                    "Impact assessment and responsible deployment"
                  ],
                  useCases: [
                    "Building trustworthy AI assistants",
                    "Creating fair hiring algorithms",
                    "Designing accessible AI tools",
                    "Developing privacy-preserving systems",
                    "Ensuring ethical content generation",
                    "Building inclusive AI applications"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Fairness = equal treatment across different groups",
                      "Transparency = users understand how AI makes decisions",
                      "Privacy = protecting user data and personal information",
                      "Bias = systematic errors that favor certain groups",
                      "Accessibility = AI works for people with disabilities",
                      "Trust = users feel confident in AI recommendations"
                    ]
                  },
                  bestFor: [
                    "Applications serving diverse user bases",
                    "Systems making important decisions",
                    "Products requiring user trust",
                    "Applications handling sensitive data",
                    "Public-facing AI systems"
                  ],
                  notIdealFor: [
                    "Internal tools with limited user interaction",
                    "Systems with no ethical implications",
                    "Applications where bias doesn't matter"
                  ]
                }}
              />

              {/* Brain Component */}
              <ConceptCard
                icon={Brain}
                title="Brain: Intelligence & Learning"
                description="The cognitive engine that powers AI reasoning and learning"
                items={[
                  "Machine learning algorithms",
                  "Neural networks and deep learning",
                  "Natural language processing",
                  "Computer vision",
                  "Reinforcement learning",
                  "Model optimization"
                ]}
                color="from-blue-500 to-indigo-500"
                documentation={{
                  overview: "The Brain component represents the intelligence and learning capabilities of AI systems. It includes algorithms, models, and techniques that enable machines to learn, reason, and make decisions.",
                  description: [
                    "Supervised learning (classification, regression)",
                    "Unsupervised learning (clustering, dimensionality reduction)",
                    "Deep learning architectures (CNNs, RNNs, Transformers)",
                    "Natural language processing models",
                    "Computer vision and image recognition",
                    "Reinforcement learning and decision-making",
                    "Model training, validation, and optimization"
                  ],
                  useCases: [
                    "Image recognition and classification",
                    "Natural language understanding",
                    "Predictive analytics",
                    "Recommendation systems",
                    "Anomaly detection",
                    "Automated decision-making"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Training = teaching AI with examples",
                      "Inference = using trained AI to make predictions",
                      "Overfitting = model memorizes training data",
                      "Underfitting = model too simple to learn patterns",
                      "Neural networks = layers of connected nodes",
                      "Fine-tuning = adapting pre-trained models"
                    ]
                  },
                  bestFor: [
                    "Pattern recognition tasks",
                    "Predictive modeling",
                    "Complex decision-making",
                    "Natural language tasks",
                    "Image and video analysis"
                  ],
                  notIdealFor: [
                    "Simple rule-based tasks",
                    "Deterministic calculations",
                    "Tasks requiring exact precision",
                    "When interpretability is critical"
                  ]
                }}
              />

              {/* Context Component */}
              <ConceptCard
                icon={FileText}
                title="Context: Understanding & Environment"
                description="The environment and data that shape AI understanding"
                items={[
                  "Data collection and preprocessing",
                  "Contextual understanding",
                  "Domain knowledge integration",
                  "Temporal and spatial context",
                  "Multi-modal data processing",
                  "Context-aware systems"
                ]}
                color="from-purple-500 to-violet-500"
                documentation={{
                  overview: "The Context component represents the environment, data, and situational understanding that enables AI to make relevant and accurate decisions. Context is what makes AI responses relevant and useful.",
                  description: [
                    "Data collection strategies and quality assessment",
                    "Data preprocessing and cleaning techniques",
                    "Context extraction from text, images, and other sources",
                    "Domain-specific knowledge integration",
                    "Temporal context (time-based understanding)",
                    "Spatial context (location-based understanding)",
                    "Multi-modal context (combining different data types)",
                    "Context preservation in conversations"
                  ],
                  useCases: [
                    "Contextual search and recommendations",
                    "Conversational AI with memory",
                    "Location-aware applications",
                    "Time-sensitive decision making",
                    "Multi-modal AI systems",
                    "Domain-specific AI applications"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Context = surrounding information that affects meaning",
                      "Data quality = clean, relevant, representative data",
                      "Preprocessing = cleaning and preparing data for AI",
                      "Domain knowledge = specialized information about a field",
                      "Temporal = time-related context",
                      "Multi-modal = combining text, images, audio, etc."
                    ]
                  },
                  bestFor: [
                    "Applications requiring situational awareness",
                    "Systems that need to remember past interactions",
                    "Domain-specific AI applications",
                    "Multi-source data integration",
                    "Personalized user experiences"
                  ],
                  notIdealFor: [
                    "Stateless, one-off interactions",
                    "Applications with no contextual needs",
                    "Simple, isolated tasks"
                  ]
                }}
              />

              {/* Instructions Component */}
              <ConceptCard
                icon={Sparkles}
                title="Instructions: Prompts & Guidance"
                description="How we communicate with AI through effective prompts and instructions"
                items={[
                  "Prompt engineering techniques",
                  "Instruction design patterns",
                  "Few-shot and zero-shot learning",
                  "Chain-of-thought prompting",
                  "System prompts and roles",
                  "Instruction optimization"
                ]}
                color="from-amber-500 to-orange-500"
                documentation={{
                  overview: "The Instructions component represents how we communicate with AI systems. Effective instructions, prompts, and guidance unlock AI capabilities and ensure desired outcomes.",
                  description: [
                    "Prompt engineering fundamentals and best practices",
                    "Instruction design patterns and templates",
                    "Few-shot learning (providing examples)",
                    "Zero-shot learning (no examples needed)",
                    "Chain-of-thought prompting (step-by-step reasoning)",
                    "System prompts and role definition",
                    "Instruction fine-tuning and optimization",
                    "Prompt testing and iteration strategies"
                  ],
                  useCases: [
                    "Building AI-powered chatbots",
                    "Creating AI content generators",
                    "Developing AI coding assistants",
                    "Designing AI analysis tools",
                    "Building AI-powered search",
                    "Creating custom AI workflows"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Prompt = instruction given to AI",
                      "Few-shot = providing examples in the prompt",
                      "Zero-shot = no examples, just instructions",
                      "Chain-of-thought = asking AI to show reasoning",
                      "System prompt = defining AI's role and behavior",
                      "Prompt engineering = crafting effective instructions"
                    ]
                  },
                  bestFor: [
                    "Applications using language models",
                    "Systems requiring specific outputs",
                    "Custom AI workflows",
                    "Content generation tasks",
                    "Analysis and summarization"
                  ],
                  notIdealFor: [
                    "Traditional rule-based systems",
                    "Applications with fixed algorithms",
                    "Systems not using language models"
                  ]
                }}
              />
            </div>
          </section>

          {/* Integration Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-8 border border-slate-600">
              <h2 className="text-3xl font-bold text-white mb-6">How Components Integrate</h2>
              <div className="space-y-6">
                <div className="bg-slate-900/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Example: AI Code Review Assistant
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-300 mb-2"><strong className="text-pink-400">Heart:</strong></p>
                      <ul className="text-gray-400 space-y-1 ml-4">
                        <li>• Ensures code follows security best practices</li>
                        <li>• Respects developer privacy</li>
                        <li>• Provides constructive, empathetic feedback</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-2"><strong className="text-blue-400">Brain:</strong></p>
                      <ul className="text-gray-400 space-y-1 ml-4">
                        <li>• Understands code patterns and syntax</li>
                        <li>• Detects bugs and potential issues</li>
                        <li>• Learns from codebase patterns</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-2"><strong className="text-purple-400">Context:</strong></p>
                      <ul className="text-gray-400 space-y-1 ml-4">
                        <li>• Understands project structure</li>
                        <li>• Remembers coding standards</li>
                        <li>• Considers team preferences</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-2"><strong className="text-amber-400">Instructions:</strong></p>
                      <ul className="text-gray-400 space-y-1 ml-4">
                        <li>• Clear prompts for code review</li>
                        <li>• Specific instructions for style checks</li>
                        <li>• Structured output format</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Learning Tips */}
          <section>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-400" />
                Learning Tips
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">1.</span>
                  <span><strong>Start with Heart:</strong> Understanding ethics and human needs helps you build better AI systems from the start.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span><strong>Master Brain fundamentals:</strong> Learn the basics of machine learning before diving into advanced techniques.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">3.</span>
                  <span><strong>Context is key:</strong> Good data and context understanding often matter more than complex algorithms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold">4.</span>
                  <span><strong>Practice Instructions:</strong> Prompt engineering is a skill - practice with different models and tasks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-400 font-bold">5.</span>
                  <span><strong>Think holistically:</strong> The best AI systems integrate all four components seamlessly.</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </SubscriptionGate>
  );
}


