import {DateTime} from "luxon";
import type {ExtensionConfig, Stream, UserExtensionConfig, UserScheduleSchema} from "../api";
import {createMockSlot, type MockSlot, mockZone} from "./mockYogsSchedule.ts";
import {devUser} from "./devAuth.ts";

// Dev-only dummy streamer schedule, for testing the user schedule in the panel and the overlay.
// Enabled by opening a dev page with `?mockUserSchedule` (14 days from 1 Dec 2026),
// or `?mockUserSchedule=today`, where the first day is today with an ended, a live and an upcoming slot.
// The `?user=test` dev user (see devAuth.ts) gets the today variant by default.
// The flag also switches the user schedule on in the configs, so the tab shows for any channel.
// Only loaded behind `import.meta.env.DEV`, so it never ships in a build.

// Per-day streams as [start hour, end hour] in London time, cycled by day:
// one stream, two streams, a day off, and a late stream that runs past midnight.
const dayLayouts: [number, number][][] = [
  [[18, 21]],
  [[12, 14], [19, 22]],
  [],
  [[22, 25]],
]

const fixedDay = (slot: MockSlot, date: DateTime, dayIndex: number): Stream[] =>
  dayLayouts[dayIndex % dayLayouts.length].map(([from, to]) => slot(date.plus({hours: from}), date.plus({hours: to})))

const todayStreams = (slot: MockSlot, now: DateTime): Stream[] => {
  const base = now.startOf('hour')
  const offsets: [number, number][] = [[-4, -2], [-1, 1], [3, 5]]
  return offsets.map(([from, to]) => slot(base.plus({hours: from}), base.plus({hours: to})))
}

export const mockUserSchedule = (startToday: boolean): UserScheduleSchema => {
  const now = DateTime.now().setZone(mockZone)
  const slot = createMockSlot(now)
  const firstDay = startToday ? now.startOf('day') : DateTime.fromObject({year: 2026, month: 12, day: 1}, {zone: mockZone})

  const streams = Array.from({length: 14}, (_, i) => {
    const date = firstDay.plus({days: i})
    return startToday && i === 0 ? todayStreams(slot, now) : fixedDay(slot, date, i)
  }).flat()

  return {
    title: 'My Jingle Jam 2026 (dummy)',
    start: streams[0].start,
    end: streams[streams.length - 1].end,
    streams,
  }
}

// The URL flag wins; dev users marked with `mockUserSchedule` (the `test` user) get the today variant without it.
const flag = () => new URLSearchParams(window.location.search).get('mockUserSchedule')
  ?? (devUser().mockUserSchedule ? 'today' : null)

// Returns the dummy schedule when the page was opened with `?mockUserSchedule` in dev, otherwise undefined.
export const devMockUserSchedule = (): UserScheduleSchema | undefined => {
  const value = flag()
  if (value === null) return undefined
  return mockUserSchedule(value === 'today')
}

// With the flag set, adds the user schedule tab so it shows for any channel.
// First, like the backend does for channels with a schedule.
export const devMockUserConfig = (config: UserExtensionConfig): UserExtensionConfig => {
  if (flag() === null) return config
  return {
    ...config,
    hasSchedule: true,
    tabs: config.tabs.includes('user-schedule') ? config.tabs : ['user-schedule', ...config.tabs],
  }
}

// With the flag set, turns on the extension-wide switch for user schedules.
export const devMockExtensionConfig = (config: ExtensionConfig): ExtensionConfig => {
  if (flag() === null) return config
  return {...config, showUserSchedule: true}
}
