import type {TESStream, TESTwitchCreator} from "./model/TwitchExtensionSchedule.ts";
import {DateTime} from "luxon";

export const log = (eventName: string, data: { [key: string]: any }) => {
  try {
    // @ts-ignore
    window.gtag('event', eventName, data)
  } catch (e) {
    console.error(e)
  }
}

export const logSlotClick = (slot: TESStream) => {
  const start = DateTime.fromISO(slot.start)
  const data = {
    slot_title: slot.title,
    slot_year: start.year,
    event_label: `${start.year}_${start.day}_${start.hour}`,
  }
  log('click_slot', data)
}
export const logCreatorFromSlotClick = (creator: TESTwitchCreator, slot: TESStream) => {
  const start = DateTime.fromISO(slot.start)
  const data = {
    slot_title: slot.title,
    slot_year: start.year,
    event_label: `${start.year}_${start.day}_${start.hour}`,
    name: creator.label,
  }
  log('click_creator_slot', data)
}
export const logCreatorSlotFilterClick = (creator: TESTwitchCreator, slot: TESStream) => {
  const start = DateTime.fromISO(slot.start)
  const data = {
    slot_title: slot.title,
    slot_year: start.year,
    event_label: `${start.year}_${start.day}_${start.hour}`,
    name: creator.label,
  }
  log('creator_slot_filter', data)
}

export const logCreator = (creator: TESTwitchCreator) => {
  log('click_creator', {
    name: creator.label,
  })
}
