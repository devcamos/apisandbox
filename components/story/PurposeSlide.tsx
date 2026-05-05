"use client"

import { motion } from "framer-motion"
import { BrainCircuit, Puzzle, Lightbulb, Eye } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"

const pieceVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -45 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
      delay: 0.4 + i * 0.2,
    },
  }),
}

const pieces = [
  { icon: Puzzle, x: -60, y: -50, color: "text-indigo-300" },
  { icon: Lightbulb, x: 60, y: -40, color: "text-yellow-300" },
  { icon: Eye, x: -50, y: 50, color: "text-cyan-300" },
  { icon: Puzzle, x: 55, y: 55, color: "text-pink-300" },
]

export default function PurposeSlide() {
  const slide = storySlides[1]

  return (
    <StorySlide bg={slide.theme.bg}>
      <motion.div className="relative mb-4" variants={childVariants}>
        <motion.div
          className="w-28 h-28 rounded-3xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center relative z-10"
          animate={{
            boxShadow: [
              "0 0 20px rgba(99, 102, 241, 0.1)",
              "0 0 50px rgba(99, 102, 241, 0.25)",
              "0 0 20px rgba(99, 102, 241, 0.1)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrainCircuit className="w-14 h-14 text-indigo-400" />
        </motion.div>

        {pieces.map((piece, i) => {
          const Icon = piece.icon
          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{ x: 0, y: 0 }}
              custom={i}
              variants={pieceVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                style={{ x: piece.x, y: piece.y }}
                animate={{ y: [piece.y - 4, piece.y + 4, piece.y - 4] }}
                transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className={`w-6 h-6 ${piece.color}`} />
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white"
        variants={childVariants}
      >
        {slide.title}
      </motion.h1>

      {slide.body.map((line, i) => (
        <motion.p
          key={i}
          className="text-xl md:text-2xl text-gray-300 leading-relaxed"
          variants={childVariants}
        >
          {line}
        </motion.p>
      ))}
    </StorySlide>
  )
}
