"use client"

import { motion } from "framer-motion"
import { Coffee, MapPin, ListChecks, Package, Search } from "lucide-react"
import StorySlide, { childVariants } from "./StorySlide"
import { storySlides } from "@/lib/learning/intro-story-content"
import { StoryBodyParagraphs, StoryHeroIcon, StoryTitle } from "./StorySlideShells"

const iconMap: Record<string, typeof Coffee> = {
  route: MapPin,
  list: ListChecks,
  box: Package,
  search: Search,
}

export default function DailyLifeSlide() {
  const slide = storySlides[3]

  return (
    <StorySlide bg={slide.theme.bg}>
      <StoryHeroIcon
        Icon={Coffee}
        containerClass="w-20 h-20 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center"
        iconClass="w-10 h-10 text-orange-400"
        glow={[
          "0 0 20px rgba(249, 115, 22, 0.1)",
          "0 0 40px rgba(249, 115, 22, 0.2)",
          "0 0 20px rgba(249, 115, 22, 0.1)",
        ]}
      />

      <StoryTitle title={slide.title} />
      <StoryBodyParagraphs body={slide.body} keyPrefix="daily" />

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-2" variants={childVariants}>
        {slide.dailyExamples?.map((ex, i) => {
          const Icon = iconMap[ex.icon] ?? Coffee
          return (
            <motion.div
              key={ex.label}
              className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4 text-left flex items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 14,
                delay: 0.8 + i * 0.15,
              }}
            >
              <motion.div
                className="mt-0.5 shrink-0"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                <Icon className="w-5 h-5 text-orange-400" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-200 font-medium">{ex.label}</p>
                <p className="text-xs text-orange-300/70 mt-0.5">{ex.algo}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </StorySlide>
  )
}
