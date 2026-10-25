import {DateTime} from "luxon";
import type {ExtensionConfig, Stream, YogsScheduleSchema, YogsScheduleSchemaDaysInner} from "../api";
import {mockZone} from "./mockYogsSchedule.ts";
import {headliners2025} from "./mockHeadliners2025.ts";

// Dev-only headliner schedule for testing the headliner card in the fundraisers tab: last year's headliners
// (mockHeadliners2025.ts), shifted so a moment of Jingle Jam 2025 is now. Enabled by opening a dev page with
// `?mockHeadliner` (2 Dec 15:00: NAKED & AFRAID live, then the Jack Manifold 24h stream),
// `?mockHeadliner=next` (2 Dec 17:00: none live, the next two later today)
// or `?mockHeadliner=two-live` (2 Dec 20:00: the 24h stream and JEN AND ALIONA live at once).
// Only loaded behind `import.meta.env.DEV`, so it never ships in a build.

// The moment of Jingle Jam 2025 (London time) that becomes now, per mode.
const anchors: Record<string, string> = {
  live: '2025-12-02T15:00',
  next: '2025-12-02T17:00',
  'two-live': '2025-12-02T20:00',
}

const flag = () => new URLSearchParams(window.location.search).get('mockHeadliner')

export const mockHeadlinerSchedule = (mode: string): YogsScheduleSchema => {
  const anchor = DateTime.fromISO(anchors[mode] ?? anchors.live, {zone: mockZone})
  const offset = DateTime.now().diff(anchor)
  const shift = (date: Date) => DateTime.fromJSDate(date).plus(offset).toJSDate()

  const streams: Stream[] = headliners2025.map(s => ({...s, start: shift(s.start), end: shift(s.end)}))

  // Grouped by the London day of the original start, like the backend's schedule days.
  const days: YogsScheduleSchemaDaysInner[] = []
  headliners2025.forEach((original, i) => {
    const key = DateTime.fromJSDate(original.start, {zone: mockZone}).toISODate()
    const previous = headliners2025[i - 1]
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
    title: 'Yogscast Jingle Jam 2025 Headliners (shifted to now)',
    start: streams[0].start,
    end: streams.reduce((end, s) => s.end > end ? s.end : end, streams[0].end),
    initialDayIndex: 0,
    days,
    streams,
  }
}

// Returns the dummy schedule when the page was opened with `?mockHeadliner` in dev, otherwise undefined.
export const devMockHeadlinerSchedule = (): YogsScheduleSchema | undefined => {
  const value = flag()
  if (value === null) return undefined
  return mockHeadlinerSchedule(value === '' ? 'live' : value)
}

// With the flag set, turns on the extension-wide switch for the headliner schedule.
export const devMockHeadlinerConfig = (config: ExtensionConfig): ExtensionConfig => {
  if (flag() === null) return config
  return {...config, showHeadlinerSchedule: true}
}
