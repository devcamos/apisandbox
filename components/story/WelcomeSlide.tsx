"use client"

import { motion } from "framer-motion"
import { Home } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-amber-400/15"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  )
}

const particles = [
  { delay: 0, x: "10%", y: "20%", size: 8 },
  { delay: 1.2, x: "80%", y: "15%", size: 12 },
  { delay: 0.6, x: "25%", y: "70%", size: 6 },
  { delay: 1.8, x: "70%", y: "60%", size: 10 },
  { delay: 0.3, x: "50%", y: "85%", size: 7 },
  { delay: 2.1, x: "90%", y: "40%", size: 9 },
  { delay: 1.5, x: "15%", y: "45%", size: 5 },
]

export default function WelcomeSlide() {
  const slide = storySlides[0]

  return (
    <StorySlide bg={slide.theme.bg}>
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      <motion.div
        className="relative z-10"
        variants={childVariants}
      >
        <motion.div
          className="w-28 h-28 rounded-3xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 20px rgba(245, 158, 11, 0.1)",
              "0 0 50px rgba(245, 158, 11, 0.25)",
              "0 0 20px rgba(245, 158, 11, 0.1)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Home className="w-14 h-14 text-amber-400" />
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
    </StorySlide>
  )
}
