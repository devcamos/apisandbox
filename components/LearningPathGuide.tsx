"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Code, Compass, GraduationCap, Network, Sparkles } from "lucide-react";

export type LearningProfileId =
  | "new-to-programming"
  | "new-to-apis"
  | "rest-ready"
  | "microservices-builder"
  | "architecture-track";

interface LearningProfile {
  id: LearningProfileId;
  label: string;
  summary: string;
  phaseId: number;
  phaseLabel: string;
  href: string;
  nextStep: string;
}

interface LearningPathGuideProps {
  onProfileChange?: (profile: LearningProfile) => void;
}

const STORAGE_KEY = "api-training-learning-profile";

const profiles: LearningProfile[] = [
  {
    id: "new-to-programming",
    label: "New to programming",
    summary: "Start with the building blocks before layering in APIs and distributed systems.",
    phaseId: 0,
    phaseLabel: "Phase 0",
    href: "/phase-0",
    nextStep: "Build a strong foundation in callbacks, HTTP, and data structures.",
  },
  {
    id: "new-to-apis",
    label: "New to APIs",
    summary: "Learn the integration mindset first so REST, GraphQL, and async patterns make sense.",
    phaseId: 1,
    phaseLabel: "Phase 1",
    href: "/phase-1",
    nextStep: "Understand contracts, protocol choices, and when to reach for each integration style.",
  },
  {
    id: "rest-ready",
    label: "Comfortable with REST",
    summary: "Move into authentication, retries, circuit breakers, and production-safe integrations.",
    phaseId: 2,
    phaseLabel: "Phase 2",
    href: "/phase-2",
    nextStep: "Focus on real third-party integration problems and resilience patterns.",
  },
  {
    id: "microservices-builder",
    label: "Building microservices",
    summary: "Dive into service-to-service communication, eventing, and tracing across systems.",
    phaseId: 3,
    phaseLabel: "Phase 3",
    href: "/phase-3",
    nextStep: "Compare sync vs async communication and practice distributed system tradeoffs.",
  },
  {
    id: "architecture-track",
    label: "Planning architecture",
    summary: "Work at the system-design level with platform strategy, tradeoffs, and migration patterns.",
    phaseId: 4,
    phaseLabel: "Phase 4",
    href: "/phase-4",
    nextStep: "Use the advanced track to reason about contracts, scale, and legacy constraints.",
  },
];

const profileIcons = {
  "new-to-programming": GraduationCap,
  "new-to-apis": BookOpen,
  "rest-ready": Brain,
  "microservices-builder": Network,
  "architecture-track": Compass,
} satisfies Record<LearningProfileId, typeof GraduationCap>;

function getInitialProfile(): LearningProfile {
  return profiles[1];
}

export function LearningPathGuide({ onProfileChange }: LearningPathGuideProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<LearningProfileId>(getInitialProfile().id);

  useEffect(() => {
    const storedProfile = window.localStorage.getItem(STORAGE_KEY) as LearningProfileId | null;
    if (!storedProfile) {
      return;
    }

    const matchingProfile = profiles.find((profile) => profile.id === storedProfile);
    if (matchingProfile) {
      setSelectedProfileId(matchingProfile.id);
    }
  }, []);

  useEffect(() => {
    const selectedProfile =
      profiles.find((profile) => profile.id === selectedProfileId) ?? getInitialProfile();

    window.localStorage.setItem(STORAGE_KEY, selectedProfile.id);
    onProfileChange?.(selectedProfile);
  }, [onProfileChange, selectedProfileId]);

  const selectedProfile =
    profiles.find((profile) => profile.id === selectedProfileId) ?? getInitialProfile();
  const SelectedIcon = profileIcons[selectedProfile.id];

  return (
    <section className="container mx-auto px-6 py-8" aria-labelledby="guided-path-heading">
      <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-blue-500/10 p-8 shadow-2xl shadow-cyan-950/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Guided dashboard feature
            </div>
            <h2 id="guided-path-heading" className="text-3xl font-bold text-white">
              Pick your starting point
            </h2>
            <p className="mt-3 text-gray-300">
              Choose the description that best matches you. The dashboard will keep your choice and
              point you to the most useful next phase instead of making you scan every card.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/50 p-5 lg:max-w-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-3">
                <SelectedIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Recommended now</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{selectedProfile.phaseLabel}</h3>
                <p className="mt-2 text-sm text-gray-300">{selectedProfile.nextStep}</p>
              </div>
            </div>
            <Link
              href={selectedProfile.href}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Go to {selectedProfile.phaseLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {profiles.map((profile) => {
            const Icon = profileIcons[profile.id];
            const isSelected = profile.id === selectedProfile.id;

            return (
              <button
                key={profile.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedProfileId(profile.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  isSelected
                    ? "border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-950/30"
                    : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-xl bg-slate-800 p-2">
                    <Icon className={`h-5 w-5 ${isSelected ? "text-cyan-200" : "text-gray-300"}`} />
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      isSelected ? "bg-cyan-300/20 text-cyan-100" : "bg-slate-700 text-gray-300"
                    }`}
                  >
                    {profile.phaseLabel}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{profile.label}</h3>
                <p className="mt-2 text-sm text-gray-300">{profile.summary}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
