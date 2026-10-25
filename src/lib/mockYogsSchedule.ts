import {DateTime} from "luxon";
import type {Stream, YogsScheduleSchema, YogsScheduleSchemaDaysInner} from "../api";
import {yogs2025} from "./mockYogs2025.ts";

// Dev-only Yogs schedule for testing countdowns and slot states: last year's real schedule (mockYogs2025.ts).
// Enabled by opening a dev page with `?mockSchedule` (moved a year on, so 1–14 Dec 2026 at the same London times),
// or `?mockSchedule=today`, shifted so 1 Dec 15:30 is now: Decorating the Tree ended, Tom & Ben live, the rest upcoming.
// Only ended slots keep their VODs, so upcoming ones don't show 2025 links.
// Only loaded behind `import.meta.env.DEV`, so it never ships in a build.

export const mockZone = 'Europe/London'

const todayAnchor = DateTime.fromObject({year: 2025, month: 12, day: 1, hour: 15, minute: 30}, {zone: mockZone})

export const mockYogsSchedule = (startToday: boolean): YogsScheduleSchema => {
  const now = DateTime.now()
  const shift = startToday
    ? (date: Date) => DateTime.fromJSDate(date).plus(now.diff(todayAnchor)).toJSDate()
    : (date: Date) => DateTime.fromJSDate(date, {zone: mockZone}).plus({years: 1}).toJSDate()

  const streams: Stream[] = yogs2025.map(s => {
    const end = shift(s.end)
    return {...s, start: shift(s.start), end, vods: end < now.toJSDate() ? s.vods : []}
  })

  // Grouped by the London day of the original start, like the backend's schedule days.
  const days: YogsScheduleSchemaDaysInner[] = []
  yogs2025.forEach((original, i) => {
    const key = DateTime.fromJSDate(original.start, {zone: mockZone}).toISODate()
    const previous = yogs2025[i - 1]
    const sameDay = previous && DateTime.fromJSDate(previous.start, {zone: mockZone}).toISODate() === key
    if (sameDay) {
      const day = days[days.length - 1]
      day.streams.push(streams[i])
      if (streams[i].end > day.end) day.end = streams[i].end
    } else {
      days.push({start: streams[i].start, end: streams[i].end, streams: [streams[i]]})
    }
  })

  return {
    title: startToday ? 'Yogscast Jingle Jam 2025 (shifted to now)' : 'Yogscast Jingle Jam 2025 (moved to 2026)',
    start: streams[0].start,
    end: days[days.length - 1].end,
    initialDayIndex: 0,
    days,
    streams,
  }
}

// Returns the 2025 schedule when the page was opened with `?mockSchedule` in dev, otherwise undefined.
export const devMockYogsSchedule = (): YogsScheduleSchema | undefined => {
  const flag = new URLSearchParams(window.location.search).get('mockSchedule')
  if (flag === null) return undefined
  return mockYogsSchedule(flag === 'today')
}
