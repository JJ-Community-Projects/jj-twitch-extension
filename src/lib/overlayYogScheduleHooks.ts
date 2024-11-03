import {useData} from "../components/common/providers/DataProvider.tsx";
import {DateTime} from "luxon";
import {createEffect, createSignal, onMount} from "solid-js";
import {useDatetimeLondonNow} from "./useNow.ts";
import {isJJ} from "./useJJDates.ts";

const getCurrentDayIndex = (now: DateTime) => {
  const {schedule} = useData()
  const index = schedule.days.findIndex(d => {
    const date = DateTime.fromISO(d.date, {
      zone: 'Europe/London'
    })
    return date.hasSame(now, 'day')
  })
  if (index === -1) {
    return 0
  }
  return index
}
const getNextDayIndex = (now: DateTime) => {
  const {schedule} = useData()
  const tomorrow = now.plus({days: 1})
  const index = schedule.days.findIndex(d => {
    const date = DateTime.fromISO(d.date, {
      zone: 'Europe/London'
    })
    return date.hasSame(tomorrow, 'day')
  })
  if (index === -1) {
    return 0
  }
  return index
}

const getCurrentStream = (now: DateTime) => {
  const {schedule} = useData()
  if (!isJJ(now)) {
    return undefined
  }
  const streams = schedule
    .days
    .flatMap(d => d.streams)
  return streams.find(s => {
    const start = DateTime.fromISO(s.start, {
      zone: 'Europe/London'
    })
    const end = DateTime.fromISO(s.end, {
      zone: 'Europe/London'
    })
    return now >= start && now <= end
  })
}

export const getFutureStreams = (now: DateTime, i?: number) => {
  const {schedule} = useData()
  const streams = schedule
    .days
    .flatMap(d => d.streams)
    .filter(s => {
      const start = DateTime.fromISO(s.start, {
        zone: 'Europe/London'
      })
      return now < start
    })
  if (i) {
    return streams.slice(0, i)
  }
  return streams
}

export const useFutureStreams = (i?: number) => {
  const now = useDatetimeLondonNow()
  return () => getFutureStreams(now(), i)
}

const getNextStream = (now: DateTime) => {
  const {schedule} = useData()
  if (!isJJ(now)) {
    return schedule.days[0].streams[0]
  }
  return getFutureStreams(now)
    .reduce((a, b) => {
      const aStart = DateTime.fromISO(a.start, {
        zone: 'Europe/London'
      })
      const bStart = DateTime.fromISO(b.start, {
        zone: 'Europe/London'
      })
      const aDiff = aStart.diff(now)
      const bDiff = bStart.diff(now)
      if (aDiff.as('milliseconds') < bDiff.as('milliseconds')) {
        return b
      } else {
        return a
      }
    })
}

const useCurrentDayIndex = () => {
  const [dayIndex, setDayIndex] = createSignal<number>(0)
  const now = useDatetimeLondonNow()
  onMount(() => {
    const now = DateTime.now().setZone('Europe/London')
    setDayIndex(getCurrentDayIndex(now))
  })
  createEffect(() => {
    const index = getCurrentDayIndex(now())
    if (index !== dayIndex()) {
      setDayIndex(index)
    }
  })
  return dayIndex
}

const useTomorrowDayIndex = () => {
  const [dayIndex, setDayIndex] = createSignal<number>(0)
  const now = useDatetimeLondonNow()
  onMount(() => {
    const now = DateTime.now().setZone('Europe/London')
    setDayIndex(getNextDayIndex(now))
  })
  createEffect(() => {
    const index = getNextDayIndex(now())
    if (index !== dayIndex()) {
      setDayIndex(index)
    }
  })
  return dayIndex
}

export const useJJDates = () => {

  const {schedule} = useData()
  const now = useDatetimeLondonNow()

  const streams = () => {
    return schedule.days.flatMap(d => d.streams)
  }
  const jjStart = () => {
    return DateTime.fromISO(streams()[0].start, {
      zone: 'Europe/London'
    })
  }

  const jjEnd = () => {
    return DateTime.fromISO(streams()[streams().length - 1].end, {
      zone: 'Europe/London'
    })
  }

  const isJJ = () => {
    return now() >= jjStart() && now() <= jjEnd()
  }

  const isBeforeJJ = () => {
    return now() < jjStart()
  }

  const isAfterJJ = () => {
    return now() > jjEnd()
  }

  return {
    jjStart,
    jjEnd,
    isJJ,
    isBeforeJJ,
    isAfterJJ
  }
}

export const useToday = () => {
  const {schedule} = useData()
  const dayIndex = useCurrentDayIndex()
  return () => schedule.days[dayIndex()]
}

export const useTomorrow = () => {
  const {schedule} = useData()
  const dayIndex = useTomorrowDayIndex()
  return () => schedule.days[dayIndex()]
}

export const useCurrentStream = () => {
  const now = useDatetimeLondonNow()
  return () => getCurrentStream(now())
  /*
  const {isJJ} = useJJDates()

  const [stream, setStream] = createStore<TESStream>(schedule.days[0].streams[0])

  const f = () => {
    if (!isJJ()) {
      setStream(schedule.days[0].streams[0])
    }
    for (let i = 0; i < schedule.days.length; i++) {
      const day = schedule.days[i]
      for (let j = 0; j < day.streams.length; j++) {
        const s = day.streams[j]
        const start = DateTime.fromISO(s.start, {
          zone: 'Europe/London'
        })
        const end = DateTime.fromISO(s.end, {
          zone: 'Europe/London'
        })
        if (now() >= start && now() <= end) {
          setStream(s)
          console.log('current stream', s)
          return
        }
      }
    }
  }

  onMount(() => {
    f()
  })

  createEffect(() => {
    f()
  })

  return stream
  */
}

export const useNextStream = () => {
  const now = useDatetimeLondonNow()
  return () => getNextStream(now())
  /*
  const streams = () => schedule
    .days
    .flatMap(d => d.streams)
    .filter(s => DateTime.fromISO(s.start, {
      zone: 'Europe/London'
    }) > now())
  const {isJJ} = useJJDates()

  const [stream, setStream] = createStore<TESStream>(schedule.days[0].streams[0])

  const f = () => {
    if (!isJJ()) {
      setStream(schedule.days[0].streams[0])
    }
    for (let i = 0; i < streams().length; i++) {
      const s = streams()[i]
      const start = DateTime.fromISO(s.start, {
        zone: 'Europe/London'
      })
      if (now() < start) {
        setStream(s)
        console.log('next stream', s)
        return
      }
    }
  }

  onMount(() => {
    f()
  })

  createEffect(() => {
    f()
  })

  return stream
  */
}
