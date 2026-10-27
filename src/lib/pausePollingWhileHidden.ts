import {focusManager} from "@tanstack/solid-query";
import {createEffect, on} from "solid-js";

// TanStack Query skips interval refetches while it thinks the page is unfocused, and refetches stale queries
// (refetchOnWindowFocus) when focus comes back. By default "focused" means the browser tab is visible, but the
// Twitch tab stays visible while a panel is scrolled away or the overlay is faded out, so every viewer would
// keep polling. Here the extension counts as focused only while it is on screen, the tab is visible and
// `active()` is true. An IntersectionObserver in an iframe measures against the top-level viewport.
// Call it from a component, so `active` is tracked.
export const pausePollingWhileHidden = (active: () => boolean = () => true) => {
  let onScreen = true
  let notify: ((focused: boolean) => void) | undefined
  const update = () => notify?.(onScreen && document.visibilityState !== 'hidden' && active())

  focusManager.setEventListener((handleFocus) => {
    notify = handleFocus
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      update()
    })
    observer.observe(document.body)
    document.addEventListener('visibilitychange', update)
    return () => {
      notify = undefined
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  })

  createEffect(on(active, update, {defer: true}))
}
