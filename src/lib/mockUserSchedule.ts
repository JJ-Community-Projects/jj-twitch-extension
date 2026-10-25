import {DateTime} from "luxon";
import type {Creator, ExtensionConfig, Stream, UserExtensionConfig, UserScheduleSchema} from "../api";
import {mockZone} from "./mockYogsSchedule.ts";
import {devUser} from "./devAuth.ts";

// Dev-only dummy streamer schedule, for testing the user schedule in the panel and the overlay.
// Enabled by opening a dev page with `?mockUserSchedule` (14 days from 1 Dec 2026),
// or `?mockUserSchedule=today`, where the first day is today with an ended, a live and an upcoming slot.
// The `?user=test` dev user (see devAuth.ts) gets the today variant by default.
// The flag also switches the user schedule on in the configs, so the tab shows for any channel.
// Only loaded behind `import.meta.env.DEV`, so it never ships in a build.

const twitchUrl = 'https://www.twitch.tv/yogscast'

const creators: Creator[] = [
  {id: 'mock-holly', name: 'Holly', color: '#3584BF', url: twitchUrl},
  {id: 'mock-ivy', name: 'Ivy', color: '#2E7D32', url: twitchUrl},
  {id: 'mock-noel', name: 'Noel', color: '#C62828', url: ''},
  {id: 'mock-carol', name: 'Carol', color: '#FBC02D', url: twitchUrl},
  {id: 'mock-jasper', name: 'Jasper', color: '#6A1B9A', url: ''},
  {id: 'mock-rudy', name: 'Rudy', color: '#EF6C00', url: twitchUrl},
  {id: 'mock-clove', name: 'Clove', color: '#00838F', url: ''},
  {id: 'mock-nutmeg', name: 'Nutmeg', color: '#5D4037', url: twitchUrl},
  {id: 'mock-pip', name: 'Pip', color: '#F8BBD0', url: ''},
  {id: 'mock-tinsel', name: 'Tinsel Twinkletoes the Third', color: '#90A4AE', url: twitchUrl},
]

const shows = [
  'Snow Fort Showdown', 'Mince Pie Bake-Off', 'Gift Wrap Speedrun', 'Late Night Lounge',
  'Board Game Bash', 'Sleigh Racing', 'Pub Quiz', 'Build Battle', 'Karaoke Night',
  'Retro Arcade', 'Tabletop Tales', 'Cosy Crafting', 'Puzzle Party', 'Morning Cuppa',
]

// Includes light colours (yellow, pink) to check text contrast in the time block and dialog header.
const colors = ['#3584BF', '#C62828', '#2E7D32', '#FBC02D', '#6A1B9A', '#EF6C00', '#00838F', '#F8BBD0']

// Creator counts cycle through none, a pair, a group and a full grid.
const groupSizes = [0, 2, 4, 10, 3]

const subtitleFor = (group: Creator[]) => {
  if (group.length === 0) return undefined
  if (group.length > 3) return `${group.slice(0, 3).map(c => c.name).join(', ')} & Friends`
  return group.map(c => c.name).join(' & ')
}

type MockSlot = (start: DateTime, end: DateTime) => Stream

// Returns a slot builder that cycles through titles, colours, group sizes and descriptions.
const createMockSlot = (now: DateTime): MockSlot => {
  let index = 0
  return (start, end) => {
    const i = index++
    const size = groupSizes[i % groupSizes.length]
    const group = Array.from({length: size}, (_, k) => creators[(i + k) % creators.length])
    return {
      title: shows[i % shows.length],
      subtitle: subtitleFor(group),
      description: i % 3 === 0 ? 'Dummy slot for testing. Join the team for a festive stream raising money for charity.' : undefined,
      start: start.toJSDate(),
      end: end.toJSDate(),
      creators: group,
      // Every other ended slot has a VOD, so both the VOD and the no-VOD state are covered.
      vods: end < now && i % 2 === 0 ? [{label: 'Twitch', link: twitchUrl}] : [],
      color: colors[i % colors.length],
    }
  }
}

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
