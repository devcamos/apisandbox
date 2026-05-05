"use client"

import { motion } from "framer-motion"
import { Hammer, Code, MessageCircle, Layers, Compass } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"

const iconMap: Record<string, typeof Hammer> = {
  hammer: Hammer,
  code: Code,
  message: MessageCircle,
  layers: Layers,
}

export default function CompletesSlide() {
  const slide = storySlides[7]

  return (
    <StorySlide bg={slide.theme.bg}>
      <motion.div variants={childVariants}>
        <motion.div
          className="w-20 h-20 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 20px rgba(20, 184, 166, 0.1)",
              "0 0 40px rgba(20, 184, 166, 0.2)",
              "0 0 20px rgba(20, 184, 166, 0.1)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Compass className="w-10 h-10 text-teal-400" />
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

      <motion.div className="w-full space-y-3 mt-2" variants={childVariants}>
        {slide.completionPaths?.map((path, i) => {
          const Icon = iconMap[path.icon] ?? Hammer
          return (
            <motion.div
              key={path.title}
              className="bg-teal-500/5 border border-teal-500/15 rounded-xl p-4 text-left flex items-start gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 14,
                delay: 0.8 + i * 0.18,
              }}
            >
              <motion.div
                className="shrink-0 w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              >
                <Icon className="w-5 h-5 text-teal-400" />
              </motion.div>
              <div>
                <p className="text-sm text-white font-semibold">{path.title}</p>
                <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">{path.description}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </StorySlide>
  )
}
