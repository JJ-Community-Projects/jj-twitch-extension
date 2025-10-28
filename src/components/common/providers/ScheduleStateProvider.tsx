import {createContext, createSignal, onMount, type ParentComponent, useContext} from "solid-js";
import {DateTime} from "luxon";
import {useAnalytics} from "./AnalyticsProvider.tsx";
import {useBackend} from "./BackendProvider.tsx";
import type {YogsScheduleSchema} from "../../../api";

const useScheduleStateHook = (
  yogsSchedule: YogsScheduleSchema
) => {
  const days = yogsSchedule.days ?? []
  const dayCount = days?.length ?? 0
  const {log} = useAnalytics()

  const streams = yogsSchedule.days.map(day => day.streams)
    .flat() ?? []


  const firstDay = yogsSchedule.start ? DateTime.fromJSDate(yogsSchedule.start) : DateTime.now().setZone('Europe/London')
  const lastDay = yogsSchedule.end ? DateTime.fromJSDate(yogsSchedule.end) : DateTime.now().setZone('Europe/London')
  const now = DateTime.now().setZone('Europe/London')

  const isNowBetween = now >= firstDay && now <= lastDay

  const [dayIndex, setDayIndex] = createSignal<number>(0)

  onMount(() => {
    if (!isNowBetween) {
      return
    }
    for (let i = 0; i < dayCount; i++) {
      const day = days[i]
      const date = DateTime.fromJSDate(day.start, {
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
      const date = DateTime.fromJSDate(day.start, {
        zone: 'Europe/London'
      })
      if (date.hasSame(today, 'day')) {
        setDayIndex(i)
        break
      }
    }
  }

  return {
    schedule: yogsSchedule,
    streams,
    day,
    nextDay,
    previousDay, switchToToday
  }
}

const ScheduleStateContext = createContext<ReturnType<typeof useScheduleStateHook>>();

export const ScheduleStateProvider: ParentComponent<{
  schedule: YogsScheduleSchema
}> = (props) => {
  const hook = useScheduleStateHook(props.schedule)
  return (
    <ScheduleStateContext.Provider value={hook}>
      {props.children}
    </ScheduleStateContext.Provider>
  );
}

export const useScheduleState = () => useContext(ScheduleStateContext)!
