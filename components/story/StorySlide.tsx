"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface StorySlideProps {
  bg: string
  children: ReactNode
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 14 },
  },
}

export default function StorySlide({ bg, children }: StorySlideProps) {
  return (
    <motion.div
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br ${bg}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="max-w-2xl w-full flex flex-col items-center text-center gap-8">
        {children}
      </div>
    </motion.div>
  )
}

export { childVariants }
