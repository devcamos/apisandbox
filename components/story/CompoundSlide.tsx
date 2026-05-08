"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"
import { StoryBodyParagraphs, StoryHeroIcon, StoryTitle } from "./StorySlideShells"

function GrowthCurve() {
  return (
    <svg viewBox="0 0 240 100" className="w-56 h-24 md:w-72 md:h-28">
      {/* Grid lines */}
      {[20, 40, 60, 80].map((y) => (
        <line
          key={y}
          x1="20"
          y1={y}
          x2="220"
          y2={y}
          stroke="rgba(139, 92, 246, 0.08)"
          strokeWidth="0.5"
        />
      ))}
      {/* Exponential growth curve */}
      <motion.path
        d="M 20 85 C 60 83, 100 78, 130 65 S 170 35, 200 18 L 220 10"
        fill="none"
        stroke="rgba(139, 92, 246, 0.6)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />
      {/* Glow underneath */}
      <motion.path
        d="M 20 85 C 60 83, 100 78, 130 65 S 170 35, 200 18 L 220 10 L 220 90 L 20 90 Z"
        fill="url(#growthGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      />
      <defs>
        <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
        </linearGradient>
      </defs>
      {/* "You are here" dot */}
      <motion.circle
        cx="80"
        cy="80"
        r="4"
        fill="rgba(139, 92, 246, 0.9)"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, delay: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.text
        x="80"
        y="96"
        textAnchor="middle"
        fill="rgba(139, 92, 246, 0.6)"
        fontSize="7"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        you are here
      </motion.text>
    </svg>
  )
}

export default function CompoundSlide() {
  const slide = storySlides[5]

  return (
    <StorySlide bg={slide.theme.bg}>
      <StoryHeroIcon
        Icon={TrendingUp}
        containerClass="w-20 h-20 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center"
        iconClass="w-10 h-10 text-violet-400"
        glow={[
          "0 0 20px rgba(139, 92, 246, 0.1)",
          "0 0 40px rgba(139, 92, 246, 0.2)",
          "0 0 20px rgba(139, 92, 246, 0.1)",
        ]}
      />

      <StoryTitle title={slide.title} />

      <motion.div variants={childVariants}>
        <GrowthCurve />
      </motion.div>

      <StoryBodyParagraphs body={slide.body} keyPrefix="compound" />
    </StorySlide>
  )
}
