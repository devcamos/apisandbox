"use client"

import { motion } from "framer-motion"
import { DoorOpen, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"
import { StoryBodyParagraphs, StoryTitle } from "./StorySlideShells"

const confettiColors = [
  "bg-cyan-400/30",
  "bg-blue-400/25",
  "bg-teal-400/25",
  "bg-indigo-400/20",
  "bg-sky-400/25",
]

function ConfettiParticle({ delay, x, color, size, spin }: Readonly<{ delay: number; x: string; color: string; size: number; spin: number }>) {
  return (
    <motion.div
      className={`absolute rounded-sm ${color}`}
      style={{ left: x, top: "-5%", width: size, height: size * 0.6 }}
      animate={{
        y: ["0vh", "105vh"],
        rotate: [0, 360 + spin],
        opacity: [0, 0.8, 0.8, 0],
      }}
      transition={{
        duration: 6 + delay * 2,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    />
  )
}

const confetti = Array.from({ length: 14 }, (_, i) => ({
  delay: i * 0.5,
  x: `${5 + (i * 7) % 90}%`,
  color: confettiColors[i % confettiColors.length],
  size: 5 + (i % 4) * 2,
  spin: ((i * 137) % 360),
}))

export default function SendoffSlide() {
  const slide = storySlides[8]

  return (
    <StorySlide bg={slide.theme.bg}>
      {confetti.map((c) => (
        <ConfettiParticle key={`${c.x}-${c.delay}-${c.size}`} {...c} />
      ))}

      <motion.div className="mb-4" variants={childVariants}>
        <motion.div
          className="w-28 h-28 rounded-3xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 20px rgba(6, 182, 212, 0.1)",
              "0 0 60px rgba(6, 182, 212, 0.3)",
              "0 0 20px rgba(6, 182, 212, 0.1)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <DoorOpen className="w-14 h-14 text-cyan-400" />
        </motion.div>
      </motion.div>

      <StoryTitle title={slide.title} />
      <StoryBodyParagraphs body={slide.body} keyPrefix="sendoff" />

      <motion.div className="flex flex-col sm:flex-row items-center gap-4 mt-4" variants={childVariants}>
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            href={slide.ctaHref ?? "/phase-5"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            {slide.ctaLabel ?? "Begin Phase 5"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <Link
          href="/start"
          className="text-gray-400 hover:text-gray-300 transition-colors text-sm underline underline-offset-4"
        >
          Explore all phases
        </Link>
      </motion.div>
    </StorySlide>
  )
}
