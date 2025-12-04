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
    return DateTime.fromJSDate(slot.end, {
      zone: 'Europe/London'
    })
  }

  static isLive(slot: Stream, now?: DateTime) {
    if (!now) {
      now = DateTime.now()
    }
    const start = YogsStreamUtils.start(slot)
    const end = YogsStreamUtils.end(slot)
    return now > start && now < end
  }

  static isOver(slot: Stream, now?: DateTime) {
    now ??= DateTime.now()
    const end = YogsStreamUtils.end(slot)
    return now > end;
  }

  static isBefore(slot: Stream, now?: DateTime) {
    now ??= DateTime.now()
    const start = YogsStreamUtils.start(slot)
    return now < start;
  }
}
