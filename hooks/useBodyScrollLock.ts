"use client";

import { useEffect } from "react";

/**
 * Locks page (background) scrolling while `locked` is true.
 *
 * Only `overflow` is changed on <html> and <body>. We deliberately do NOT
 * attach `touchmove` listeners with `preventDefault()` (a common iOS hack),
 * because that also blocks touch scrolling inside the drawer itself. The
 * drawer scrolls in its own container with `overscroll-behavior: contain`,
 * so the scroll never chains back to the page.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { documentElement: html, body } = document;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
    };
  }, [locked]);
}
