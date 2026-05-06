"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import WelcomeSlide from "@/components/story/WelcomeSlide"
import PurposeSlide from "@/components/story/PurposeSlide"
import AlgorithmsSlide from "@/components/story/AlgorithmsSlide"
import DailyLifeSlide from "@/components/story/DailyLifeSlide"
import SlowBuildSlide from "@/components/story/SlowBuildSlide"
import CompoundSlide from "@/components/story/CompoundSlide"
import CommunitySlide from "@/components/story/CommunitySlide"
import CompletesSlide from "@/components/story/CompletesSlide"
import SendoffSlide from "@/components/story/SendoffSlide"
import { storySlides } from "@/lib/learning/intro-story-content"

const slides = [
  WelcomeSlide,
  PurposeSlide,
  AlgorithmsSlide,
  DailyLifeSlide,
  SlowBuildSlide,
  CompoundSlide,
  CommunitySlide,
  CompletesSlide,
  SendoffSlide,
]

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

const pageTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
}

export default function StoryPage() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const router = useRouter()
  const total = slides.length

  const goNext = useCallback(() => {
    if (current < total - 1) {
      setDirection(1)
      setCurrent((c) => c + 1)
    }
  }, [current, total])

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((c) => c - 1)
    }
  }, [current])

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current]
  )

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === "Escape") {
        router.back()
      }
    }
    globalThis.addEventListener("keydown", handleKeyDown)
    return () => globalThis.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev, router])

  const ActiveSlide = slides[current]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Close button */}
      <motion.button
        onClick={() => router.back()}
        className="fixed top-6 right-6 z-50 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        aria-label="Close story"
      >
        <X className="w-5 h-5" />
      </motion.button>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
        >
          <ActiveSlide />
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <motion.div
        className="fixed bottom-0 inset-x-0 z-50 pb-8 pt-16 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-center gap-6 pointer-events-auto">
          {/* Back button */}
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2.5">
            {storySlides.map((slide, i) => (
              <button
                key={`story-nav-${slide.id}`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to page ${i + 1}`}
                className="group relative p-1"
              >
                <motion.div
                  className="w-2.5 h-2.5 rounded-full transition-colors"
                  animate={{
                    scale: i === current ? 1.4 : 1,
                    backgroundColor:
                      i === current
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </button>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={goNext}
            disabled={current === total - 1}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Page counter */}
        <p className="text-center text-xs text-gray-500 mt-3">
          {current + 1} of {total}
        </p>
      </motion.div>
    </div>
  )
}
