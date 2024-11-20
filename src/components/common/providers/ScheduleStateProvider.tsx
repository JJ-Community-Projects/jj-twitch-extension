import {createContext, createSignal, onMount, type ParentComponent, useContext} from "solid-js";
import {DateTime} from "luxon";
import {useData} from "./DataProvider.tsx";
import {useAnalytics} from "./AnalyticsProvider.tsx";

const useScheduleStateHook = () => {
  const {schedule} = useData()
  const days = schedule.days
  const dayCount = days.length
  const {log} = useAnalytics()

  const streams = schedule.days.map(day => day.streams).flat()


  const firstDay = DateTime.fromFormat(days[0].date, 'yyyy-MM-dd', {
    zone: 'Europe/London'
  })
  const lastDay = DateTime.fromFormat(days[dayCount - 1].date, 'yyyy-MM-dd', {
    zone: 'Europe/London'
  })
  const now = DateTime.now().setZone('Europe/London')

  const isNowBetween = now >= firstDay && now <= lastDay

  const [dayIndex, setDayIndex] = createSignal<number>(0)

  onMount(() => {
    if (!isNowBetween) {
      return
    }
    for (let i = 0; i < dayCount; i++) {
      const day = days[i]
      const date = DateTime.fromFormat(day.date, 'yyyy-MM-dd', {
        zone: 'Europe/London'
      })
      if (date.hasSame(now, 'day')) {
        setDayIndex(i)
        break
      }
    }
  })

  const nextDay = () => {
    const next = (dayIndex() + 1) % dayCount
    setDayIndex(next)
    log('schedule_next', {
      day: next,
    })
  }
  const previousDay = () => {
    const next = (dayIndex() - 1 + dayCount) % dayCount
    setDayIndex(next)
    log('schedule_prev', {
      day: next,
    })
  }

  const day = () => days[dayIndex()]

  const switchToToday = () => {
    const today = DateTime.now().setZone('Europe/London')
    for (let i = 0; i < dayCount; i++) {
      const day = days[i]
      const date = DateTime.fromFormat(day.date, 'yyyy-MM-dd', {
        zone: 'Europe/London'
      })
      if (date.hasSame(today, 'day')) {
        setDayIndex(i)
        break
      }
    }
  }

  return {
    schedule,
    streams,
    day,
    nextDay,
    previousDay, switchToToday
  }
}

const ScheduleStateContext = createContext<ReturnType<typeof useScheduleStateHook>>();

export const ScheduleStateProvider: ParentComponent = (props) => {
  const hook = useScheduleStateHook()
  return (
    <ScheduleStateContext.Provider value={hook}>
      {props.children}
    </ScheduleStateContext.Provider>
  );
}

export const useScheduleState = () => useContext(ScheduleStateContext)!
