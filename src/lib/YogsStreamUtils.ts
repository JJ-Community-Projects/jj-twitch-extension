import {DateTime} from "luxon";
import type {TESStream} from "./model/TwitchExtensionSchedule.ts";

export class YogsStreamUtils {
  static duration(slot: TESStream) {
    const start = DateTime.fromISO(slot.start, {
      zone: 'Europe/London'
    })
    const end = DateTime.fromISO(slot.end, {
      zone: 'Europe/London'
    })
    return end.diff(start).as('second')
  }

  static start(slot: TESStream) {
    return DateTime.fromISO(slot.start, {
      zone: 'Europe/London'
    })
  }

  static end(slot: TESStream) {
    return YogsStreamUtils.start(slot).plus(YogsStreamUtils.duration(slot))
  }

  static sortByNextStream(a: TESStream, b: TESStream, now?: DateTime) {
    if (YogsStreamUtils.isLive(a, now) && !YogsStreamUtils.isLive(b, now)) {
      return -1
    }
    if (YogsStreamUtils.isLive(b, now) && !YogsStreamUtils.isLive(a, now)) {
      return 1
    }

    const startA = YogsStreamUtils.nextStream(a, now)
    const startB = YogsStreamUtils.nextStream(b, now)
    return startA.diff(startB).as('second')
  }

  static nextStream(slot: TESStream, now?: DateTime) {
    if (!now) {
      now = DateTime.now()
    }
    const start = YogsStreamUtils.start(slot)
    const duration = YogsStreamUtils.duration(slot)

    const add = start.diff(now).as('day') % 7

      return start
  }

  static nextStreamEnd(slot: TESStream, now?: DateTime) {
    return YogsStreamUtils.nextStream(slot, now).plus(YogsStreamUtils.duration(slot))
  }

  static isLive(slot: TESStream, now?: DateTime) {
    if (!now) {
      now = DateTime.now()
    }
    const start = YogsStreamUtils.nextStream(slot, now)
    const end = YogsStreamUtils.nextStreamEnd(slot, now)
    return now > start && now < end
  }

  static isOver(slot: TESStream, now?: DateTime) {
    now ??= DateTime.now()
    return now > YogsStreamUtils.nextStream(slot, now).plus(YogsStreamUtils.duration(slot))
  }

  static isBefore(slot: TESStream, now?: DateTime) {
    now ??= DateTime.now()
    return now < YogsStreamUtils.nextStream(slot, now)
  }
}
