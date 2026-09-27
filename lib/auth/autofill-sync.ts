/**
 * Sync browser/password-manager autofill into React controlled state.
 * Chrome often fills inputs without firing onChange; onInput + a post-mount
 * read closes that gap without clearing values on mount.
 */

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
