"use client"

interface BulletListCardProps {
  heading: string
  items: readonly string[]
  containerClass?: string
  headingClass?: string
  listClass?: string
  dotClass?: string
  itemTextClass?: string
  ordered?: boolean
}

export default function BulletListCard({
  heading,
  items,
  containerClass = "bg-slate-800/50 border border-slate-700 rounded-2xl p-6",
  headingClass = "text-xl font-bold text-white mb-3",
  listClass = "space-y-3 text-gray-300",
  dotClass = "mt-2 h-2 w-2 rounded-full bg-cyan-300",
  itemTextClass = "",
  ordered = false,
}: Readonly<BulletListCardProps>) {
  if (ordered) {
    return (
      <article className={containerClass}>
        <h3 className={headingClass}>{heading}</h3>
        <ol className={`${listClass} list-decimal list-inside`}>
          {items.map((item) => (
            <li key={item} className={`leading-7 ${itemTextClass}`.trim()}>
              {item}
            </li>
          ))}
        </ol>
      </article>
    )
  }
  return (
    <article className={containerClass}>
      <h3 className={headingClass}>{heading}</h3>
      <ul className={listClass}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className={dotClass} />
            <span className={itemTextClass}>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

interface CompactBulletListCardProps {
  heading: string
  items: readonly string[]
  containerClass: string
  headingClass: string
  listClass: string
  dotClass: string
}

export function CompactBulletListCard({
  heading,
  items,
  containerClass,
  headingClass,
  listClass,
  dotClass,
}: Readonly<CompactBulletListCardProps>) {
  return (
    <div className={containerClass}>
      <div className={headingClass}>{heading}</div>
      <ul className={listClass}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className={dotClass} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
