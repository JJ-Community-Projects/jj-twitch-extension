import {DateTime} from 'luxon'
import {useDatetimeLondonNow, useNow} from './useNow'

const london = 'Europe/London'

export const getNextJJStartDate = (now: DateTime) => {
  if (isAfterJJEnd(now)) {
    return DateTime.fromObject(
      {
        year: now.year + 1,
        month: 12,
        day: 1,
        hour: 17,
      },
      {
        zone: london,
      },
    )
  }
  return DateTime.fromObject(
    {
      year: now.year,
      month: 12,
      day: 1,
      hour: 17,
    },
    {
      zone: london,
    },
  )
}

export const useNextJJStartDate = (init?: DateTime) => {
  const now = useDatetimeLondonNow(init)
  return () => getNextJJStartDate(now())
}


export const getNextJJEndDate = (now: DateTime) => {
  return DateTime.fromObject(
    {
      year: now.year,
      month: 12,
      day: 15,
      hour: 0,
      minute: 0,
      second: 0,
    },
    {
      zone: london,
    },
  )
}

export const useNextJJEndDate = (init?: DateTime) => {
  const now = useDatetimeLondonNow(init)
  return () => getNextJJEndDate(now())
}


export const isAfterJJEnd = (now: DateTime) => {
  return now > getNextJJEndDate(now)
}

export const useIsAfterJJEnd = (init?: DateTime) => {
  const now = useDatetimeLondonNow(init)
  return () => isAfterJJEnd(now())
}


export const isBeforeJJ = (now: DateTime) => {
  return now < getNextJJStartDate(now)
}

export const useIsBeforeJJ = (init?: DateTime) => {
  const now = useDatetimeLondonNow(init)
  return () => isBeforeJJ(now())
}


export const isJJ = (now: DateTime) => {
  return !isBeforeJJ(now) && !isAfterJJEnd(now)
}

export const useIsJJ = (init?: DateTime) => {
  const now = useNow(init)
  return () => isJJ(now())
}


export const getJJStartCountdown = (now: DateTime) => {
  const jjStartDate = getNextJJStartDate(now)
  return jjStartDate.diff(now)
}

export const useJJStartCountdown = (init?: DateTime) => {
  const now = useNow(init)
  return () => getJJStartCountdown(now())
}
