"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedTabPanelProps {
  tabKey: string
  testId?: string
  children: ReactNode
}

export default function AnimatedTabPanel({
  tabKey,
  testId,
  children,
}: Readonly<AnimatedTabPanelProps>) {
  return (
    <motion.div
      key={tabKey}
      data-testid={testId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  )
}
