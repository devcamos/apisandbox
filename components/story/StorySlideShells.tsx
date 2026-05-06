"use client"

import { motion } from "framer-motion"
import type { ComponentType, ReactNode } from "react"
import { childVariants } from "./StorySlide"

interface StoryHeroIconProps {
  Icon: ComponentType<{ className?: string }>
  containerClass: string
  iconClass: string
  glow: readonly [string, string, string]
  duration?: number
}

export function StoryHeroIcon({
  Icon,
  containerClass,
  iconClass,
  glow,
  duration = 3,
}: Readonly<StoryHeroIconProps>) {
  return (
    <motion.div variants={childVariants}>
      <motion.div
        className={containerClass}
        animate={{ boxShadow: [glow[0], glow[1], glow[2]] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className={iconClass} />
      </motion.div>
    </motion.div>
  )
}

interface StoryTitleProps {
  title: string
}

export function StoryTitle({ title }: Readonly<StoryTitleProps>) {
  return (
    <motion.h1
      className="text-4xl md:text-5xl font-bold text-white"
      variants={childVariants}
    >
      {title}
    </motion.h1>
  )
}

interface StoryBodyParagraphsProps {
  body: readonly string[]
  keyPrefix?: string
}

export function StoryBodyParagraphs({ body, keyPrefix }: Readonly<StoryBodyParagraphsProps>) {
  return (
    <>
      {body.map((line) => (
        <motion.p
          key={keyPrefix ? `${keyPrefix}-${line}` : line}
          className="text-xl md:text-2xl text-gray-300 leading-relaxed"
          variants={childVariants}
        >
          {line}
        </motion.p>
      ))}
    </>
  )
}

interface StoryTextBlockProps {
  title: string
  body: readonly string[]
  keyPrefix?: string
  before?: ReactNode
  after?: ReactNode
}

export function StoryTextBlock({
  title,
  body,
  keyPrefix,
  before,
  after,
}: Readonly<StoryTextBlockProps>) {
  return (
    <>
      {before}
      <StoryTitle title={title} />
      {after}
      <StoryBodyParagraphs body={body} keyPrefix={keyPrefix} />
    </>
  )
}
