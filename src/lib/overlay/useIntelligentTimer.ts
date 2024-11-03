import {createEffect, createSignal, onCleanup} from "solid-js";

export const useIntelligentTimer = () => {
  const [current, setCurrent] = createSignal<NodeJS.Timeout>()
  const [end, setEnd] = createSignal<number>()

  const start = ((callback: () => void, time: number) => {
    const newEnd = Date.now() + time;
    const e = end()
    if (e && newEnd < e) {
      return;
    }
    if (current()) {
      clearTimeout(current())
    }
    setEnd(newEnd)
    setCurrent(setTimeout(() => {
      callback()
      setEnd(undefined)
    }, time))
  })

  const stop = (() => {
    if (current()) {
      clearTimeout(current())
    }
    setEnd(undefined)
  })


  onCleanup(() => {
    if (current()) {
      clearTimeout(current())
    }
  })

  return [start, stop] as [typeof start, typeof stop]
}
