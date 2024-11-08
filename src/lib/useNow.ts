import {createSignal, onCleanup} from 'solid-js'
import {DateTime} from 'luxon'

const london = 'Europe/London'

export const useDatetimeLondonNow = (init?: DateTime) => {
  const [date, setDate] = createSignal(init ?? DateTime.now().setZone(london))
  const interval = setInterval(() => setDate(init ?? DateTime.now().setZone(london)), 1000)
  onCleanup(() => clearInterval(interval))
  return date
}

export const useNow = (init?: DateTime) => {
  const [date, setDate] = createSignal(init ?? DateTime.now())
  const interval = setInterval(() => setDate(init ?? DateTime.now()), 1000)
  onCleanup(() => clearInterval(interval))
  return date
}
