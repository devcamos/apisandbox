"use client"

import { motion } from "framer-motion"
import { Wifi, Users, Wallet, Truck, ArrowRightLeft } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"
import { StoryBodyParagraphs, StoryHeroIcon, StoryTitle } from "./StorySlideShells"

const iconMap: Record<string, typeof Wifi> = {
  wifi: Wifi,
  users: Users,
  wallet: Wallet,
  truck: Truck,
}

export default function SlowBuildSlide() {
  const slide = storySlides[4]

  return (
    <StorySlide bg={slide.theme.bg}>
      <StoryHeroIcon
        Icon={ArrowRightLeft}
        containerClass="w-20 h-20 rounded-full bg-rose-500/15 border border-rose-500/25 flex items-center justify-center"
        iconClass="w-10 h-10 text-rose-400"
        glow={[
          "0 0 20px rgba(244, 63, 94, 0.1)",
          "0 0 40px rgba(244, 63, 94, 0.2)",
          "0 0 20px rgba(244, 63, 94, 0.1)",
        ]}
      />

      <StoryTitle title={slide.title} />
      <StoryBodyParagraphs body={slide.body} keyPrefix="slow-build" />

      <motion.div className="w-full space-y-3 mt-2" variants={childVariants}>
        {slide.dailyExamples?.map((ex, i) => {
          const Icon = iconMap[ex.icon] ?? Wifi
          return (
            <motion.div
              key={ex.label}
              className="bg-rose-500/5 border border-rose-500/15 rounded-xl p-4 text-left"
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 14,
                delay: 0.7 + i * 0.18,
              }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                >
                  <Icon className="w-4 h-4 text-rose-400" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">{ex.label}</p>
                  <p className="text-xs text-rose-300/60 mt-1">{ex.algo}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </StorySlide>
  )
}
