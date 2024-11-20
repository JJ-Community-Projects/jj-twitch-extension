import { createContext, createEffect, type ParentComponent, useContext } from 'solid-js'
import { DateTime } from 'luxon'
import type {TESStream} from "../../../lib/model/TwitchExtensionSchedule.ts";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";

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
      } catch (e) {
        console.error('ap', 'error', e)
      }
      return
    }
  }

  const logSlotClick = (slot: TESStream) => {
    const start = DateTime.fromISO(slot.start, {
      setZone: true,
    })
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
