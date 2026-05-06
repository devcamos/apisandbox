"use client"

import { motion } from "framer-motion"
import { Hash, GitBranch, ListOrdered, Network } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"

const dsIcons = [
  { icon: Hash, label: "Hash Map", color: "text-emerald-300", delay: 0.8 },
  { icon: GitBranch, label: "Tree", color: "text-green-300", delay: 1.1 },
  { icon: ListOrdered, label: "Queue", color: "text-teal-300", delay: 1.4 },
  { icon: Network, label: "Graph", color: "text-lime-300", delay: 1.7 },
]

function TangleToStructure() {
  return (
    <svg viewBox="0 0 200 120" className="w-48 h-28 md:w-64 md:h-36">
      {/* Tangled path that draws in then morphs to structured */}
      <motion.path
        d="M 20 60 C 40 20, 60 100, 80 40 S 120 90, 140 50 S 170 80, 180 60"
        fill="none"
        stroke="rgba(52, 211, 153, 0.3)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Clean structured path that fades in after */}
      <motion.path
        d="M 20 60 L 60 60 L 80 30 L 100 60 L 120 30 L 140 60 L 180 60"
        fill="none"
        stroke="rgba(52, 211, 153, 0.8)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
      />
      {/* Nodes on the structured path */}
      {[
        { cx: 20, cy: 60 },
        { cx: 60, cy: 60 },
        { cx: 80, cy: 30 },
        { cx: 100, cy: 60 },
        { cx: 120, cy: 30 },
        { cx: 140, cy: 60 },
        { cx: 180, cy: 60 },
      ].map((node, i) => (
        <motion.circle
          key={`${node.cx}-${node.cy}`}
          cx={node.cx}
          cy={node.cy}
          r="5"
          fill="rgba(52, 211, 153, 0.9)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 12,
            delay: 2.0 + i * 0.12,
          }}
        />
      ))}
    </svg>
  )
}

export default function AlgorithmsSlide() {
  const slide = storySlides[2]

  return (
    <StorySlide bg={slide.theme.bg}>
      <motion.div className="mb-2" variants={childVariants}>
        <TangleToStructure />
      </motion.div>

      <motion.div className="flex items-center gap-5 md:gap-8 mb-2" variants={childVariants}>
        {dsIcons.map(({ icon: Icon, label, color, delay }) => (
          <motion.div
            key={label}
            className="flex flex-col items-center gap-1.5"
            initial={{ opacity: 0, y: 30, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 10,
              delay,
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
            >
              <Icon className={`w-8 h-8 ${color}`} />
            </motion.div>
            <span className="text-xs text-gray-500 hidden md:block">{label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white"
        variants={childVariants}
      >
        {slide.title}
      </motion.h1>

      {slide.body.map((line) => (
        <motion.p
          key={line}
          className="text-xl md:text-2xl text-gray-300 leading-relaxed"
          variants={childVariants}
        >
          {line}
        </motion.p>
      ))}
    </StorySlide>
  )
}
