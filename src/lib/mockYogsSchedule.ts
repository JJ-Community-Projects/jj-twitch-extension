import {DateTime} from "luxon";
import type {Creator, Stream, YogsScheduleSchema, YogsScheduleSchemaDaysInner} from "../api";

// Dev-only dummy Yogs schedule for Jingle Jam 2026, for testing countdowns and slot states.
// Enabled by opening a dev page with `?mockSchedule` (14 days from 1 Dec 2026),
// or `?mockSchedule=today`, where the first day is today with ended, live and upcoming slots around now.
// Only loaded behind `import.meta.env.DEV`, so it never ships in a build.

const zone = 'Europe/London'
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

// [start hour, end hour] in London time.
const slotHours: [number, number][] = [[11, 14], [14, 17], [17, 20], [20, 23]]

let slotIndex = 0

const subtitleFor = (group: Creator[]) => {
  if (group.length === 0) return undefined
  if (group.length > 3) return `${group.slice(0, 3).map(c => c.name).join(', ')} & Friends`
  return group.map(c => c.name).join(' & ')
}

const slot = (start: DateTime, end: DateTime, now: DateTime): Stream => {
  const i = slotIndex++
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

const day = (streams: Stream[], date: DateTime): YogsScheduleSchemaDaysInner => ({
  start: date.startOf('day').toJSDate(),
  end: date.endOf('day').toJSDate(),
  streams,
})

const fixedDay = (date: DateTime, now: DateTime) => day(
  slotHours.map(([from, to]) => slot(date.set({hour: from}), date.set({hour: to}), now)),
  date,
)

// Slots placed relative to now: two ended, one live, then upcoming ones under a day away.
const todayDay = (now: DateTime) => {
  const base = now.startOf('hour')
  const offsets: [number, number][] = [[-5, -3], [-3, -1], [-1, 1], [1, 2], [2, 4]]
  return day(offsets.map(([from, to]) => slot(base.plus({hours: from}), base.plus({hours: to}), now)), now)
}

export const mockYogsSchedule = (startToday: boolean): YogsScheduleSchema => {
  slotIndex = 0
  const now = DateTime.now().setZone(zone)
  const firstDay = startToday ? now.startOf('day') : DateTime.fromObject({year: 2026, month: 12, day: 1}, {zone})

  const days = Array.from({length: 14}, (_, i) => {
    const date = firstDay.plus({days: i})
    return startToday && i === 0 ? todayDay(now) : fixedDay(date, now)
  })

  return {
    title: 'Jingle Jam 2026 (dummy)',
    start: days[0].start,
    end: days[days.length - 1].end,
    initialDayIndex: 0,
    days,
    streams: days.flatMap(d => d.streams),
  }
}

// Returns the dummy schedule when the page was opened with `?mockSchedule` in dev, otherwise undefined.
export const devMockYogsSchedule = (): YogsScheduleSchema | undefined => {
  const flag = new URLSearchParams(window.location.search).get('mockSchedule')
  if (flag === null) return undefined
  return mockYogsSchedule(flag === 'today')
}
