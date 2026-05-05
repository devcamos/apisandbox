"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    text: "text-blue-200",
    dot: "bg-blue-400",
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    text: "text-sky-200",
    dot: "bg-sky-400",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/25",
    text: "text-green-200",
    dot: "bg-green-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    text: "text-rose-200",
    dot: "bg-rose-400",
  },
}

export default function CommunitySlide() {
  const slide = storySlides[6]

  return (
    <StorySlide bg={slide.theme.bg}>
      <motion.div variants={childVariants}>
        <motion.div
          className="w-20 h-20 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 20px rgba(168, 85, 247, 0.1)",
              "0 0 40px rgba(168, 85, 247, 0.2)",
              "0 0 20px rgba(168, 85, 247, 0.1)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Users className="w-10 h-10 text-purple-400" />
        </motion.div>
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

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2"
        variants={childVariants}
      >
        {slide.companyQuotes?.map((quote, i) => {
          const colors = colorMap[quote.color] ?? colorMap.blue
          return (
            <motion.div
              key={quote.company}
              className={`${colors.bg} border ${colors.border} rounded-xl p-5 text-left`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 14,
                delay: 0.8 + i * 0.2,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className={`w-3 h-3 rounded-full ${colors.dot}`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
                <span className="text-sm font-semibold text-white">{quote.company}</span>
              </div>
              <p className={`text-sm leading-relaxed ${colors.text}`}>{quote.text}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </StorySlide>
  )
}
