import {DateTime} from "luxon";
import type {Stream} from "../api";

export class YogsStreamUtils {
  static duration(slot: Stream) {
    const start = DateTime.fromJSDate(slot.start, {
      zone: 'Europe/London'
    })
    const end = DateTime.fromJSDate(slot.end, {
      zone: 'Europe/London'
    })
    return end.diff(start).as('second')
  }

  static start(slot: Stream) {
    return DateTime.fromJSDate(slot.start, {
      zone: 'Europe/London'
    })
  }

  static end(slot: Stream) {
    return YogsStreamUtils.start(slot).plus(YogsStreamUtils.duration(slot))
  }

  static sortByNextStream(a: Stream, b: Stream, now?: DateTime) {
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

  static nextStream(slot: Stream, now?: DateTime) {
    if (!now) {
      now = DateTime.now()
    }
    const start = YogsStreamUtils.start(slot)
    const duration = YogsStreamUtils.duration(slot)

    const add = start.diff(now).as('day') % 7

      return start
  }

  static nextStreamEnd(slot: Stream, now?: DateTime) {
    return YogsStreamUtils.nextStream(slot, now).plus(YogsStreamUtils.duration(slot))
  }

  static isLive(slot: Stream, now?: DateTime) {
    if (!now) {
      now = DateTime.now()
    }
    const start = YogsStreamUtils.nextStream(slot, now)
    const end = YogsStreamUtils.nextStreamEnd(slot, now)
    return now > start && now < end
  }

  static isOver(slot: Stream, now?: DateTime) {
    now ??= DateTime.now()
    return now > YogsStreamUtils.nextStream(slot, now).plus(YogsStreamUtils.duration(slot))
  }

  static isBefore(slot: Stream, now?: DateTime) {
    now ??= DateTime.now()
    return now < YogsStreamUtils.nextStream(slot, now)
  }
}
