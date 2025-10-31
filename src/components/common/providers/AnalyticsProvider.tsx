import { createContext, createEffect, type ParentComponent, useContext } from 'solid-js'
import { DateTime } from 'luxon'
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import type {Stream} from "../../../api";

const useAnalyticsHook = () => {
  const { auth } = useTwitchAuth()
  const channelId = () => auth?.channelId

  const log = (eventName: string, data?: { [key: string]: any }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.gtag !== undefined) {
      try {
        let completeData = { channelId: channelId() }
        if (data) {
          completeData = { ...completeData, ...data }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.gtag('event', eventName, completeData)
        console.log('ap', eventName)
      } catch (e) {
        console.error('ap', 'error', e)
      }
      return
    }else{
      console.log('ap', 'no gtag')
    }
  }

  const logSlotClick = (slot: Stream) => {
    const start = DateTime.fromJSDate(slot.start)
    const data = {
      slot_title: slot.title,
      slot_year: start.year,
      event_label: `${start.year}_${start.day}_${start.hour}`,
    }
    log('click_slot', data)
  }
  createEffect(() => {
    if (channelId()) {
      log('loaded')
    } else {
      log('loaded', { channelId: 'unknown' })
    }
  })
  return { logSlotClick, log }
}

const AnalyticsContext = createContext<ReturnType<typeof useAnalyticsHook>>()

export const AnalyticsProvider: ParentComponent = props => {
  const hook = useAnalyticsHook()
  return <AnalyticsContext.Provider value={hook}>{props.children}</AnalyticsContext.Provider>
}

export const useAnalytics = () => useContext(AnalyticsContext)!
