/**
 * Sync browser/password-manager autofill into React controlled state.
 *
 * Chrome often fills the DOM without a reliable React onChange, and selecting
 * an autofill suggestion commonly blurs the field before React state updates.
 * Blur handlers must therefore validate `event.currentTarget.value` (or the
 * input ref), never a closed-over state snapshot. onInput + post-mount /
 * focus polling closes the remaining silent-fill gaps.
 */

import { useEffect, useRef, type RefObject } from "react"

export function readAutofilledValue(el: HTMLInputElement | null | undefined): string {
  return el?.value ?? ""
}

/** If the DOM already has a value the React state does not, adopt it. */
export function adoptAutofilledValue(
  el: HTMLInputElement | null | undefined,
  current: string,
  setValue: (next: string) => void,
): void {
  const filled = readAutofilledValue(el)
  if (filled && filled !== current) {
    setValue(filled)
  }
}

/**
 * Always prefer the live DOM value (autofill / password managers) over a
 * possibly stale React state snapshot. Updates state when they differ.
 */
export function syncValueFromDom(
  el: HTMLInputElement | null | undefined,
  current: string,
  setValue: (next: string) => void,
): string {
  const filled = readAutofilledValue(el)
  if (filled !== current) {
    setValue(filled)
  }
  return filled
}

/**
 * Read the value from a blur/change/input event and push it into React state.
 * Use this in onBlur so validation never runs against a stale closure.
 */
export function syncValueFromEvent(
  event: { currentTarget: HTMLInputElement },
  setValue: (next: string) => void,
): string {
  const next = event.currentTarget.value
  setValue(next)
  return next
}

/** Keep a ref aligned with the latest render value (updated in an effect). */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}

type AutofillField = {
  ref: RefObject<HTMLInputElement | null>
  /** Latest React state for this field (read via ref so the effect stays stable). */
  getCurrent: () => string
  setValue: (next: string) => void
}

/**
 * Keep controlled inputs aligned with browser autofill:
 * - one frame after mount (password managers that fill on load)
 * - while focused (short poll — Chrome may fill without input events)
 * - on blur (final adopt before validation in the form handler)
 */
export function useAutofillSync(fields: AutofillField[]): void {
  const fieldsRef = useRef(fields)
  useEffect(() => {
    fieldsRef.current = fields
  }, [fields])

  useEffect(() => {
    const adoptAll = () => {
      for (const field of fieldsRef.current) {
        adoptAutofilledValue(field.ref.current, field.getCurrent(), field.setValue)
      }
    }

    const frame = globalThis.requestAnimationFrame(adoptAll)
    const listeners: Array<() => void> = []

    fieldsRef.current.forEach((_, index) => {
      const el = fieldsRef.current[index]?.ref.current
      if (!el) return

      let pollId: ReturnType<typeof globalThis.setInterval> | undefined
      const stopPoll = () => {
        if (pollId !== undefined) {
          globalThis.clearInterval(pollId)
          pollId = undefined
        }
      }
      const adoptThis = () => {
        const field = fieldsRef.current[index]
        if (!field) return
        adoptAutofilledValue(field.ref.current, field.getCurrent(), field.setValue)
      }
      const onFocus = () => {
        adoptThis()
        stopPoll()
        pollId = globalThis.setInterval(adoptThis, 50)
      }
      const onBlur = () => {
        stopPoll()
        adoptThis()
      }

      el.addEventListener("focus", onFocus)
      el.addEventListener("blur", onBlur)
      listeners.push(() => {
        stopPoll()
        el.removeEventListener("focus", onFocus)
        el.removeEventListener("blur", onBlur)
      })
    })

    return () => {
      globalThis.cancelAnimationFrame(frame)
      for (const dispose of listeners) dispose()
    }
  }, [])
}
