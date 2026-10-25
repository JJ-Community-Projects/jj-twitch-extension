import {type Component, createMemo, For, type JSX} from "solid-js";
import {DateTime} from "luxon";
import type {Stream} from "../../../api";
import {YogsStreamUtils} from "../../../lib/YogsStreamUtils.ts";
import {useNow} from "../../../lib/useNow.ts";

interface ScheduleDayGroupsProps {
  // Expected in start order, as the API returns them.
  streams: Stream[]
  children: (stream: Stream) => JSX.Element
}

// Splits a list of streams into days with a divider header above each day.
// Days follow the viewer's time zone, matching the local times on the slot items.
export const ScheduleDayGroups: Component<ScheduleDayGroupsProps> = (props) => {
  const days = createMemo(() => {
    const groups: { day: DateTime, streams: Stream[] }[] = []
    for (const stream of props.streams) {
      const day = YogsStreamUtils.start(stream).toLocal().startOf('day')
      const last = groups[groups.length - 1]
      if (last && last.day.hasSame(day, 'day')) {
        last.streams.push(stream)
      } else {
        groups.push({day, streams: [stream]})
      }
    }
    return groups
  })

  return (
    <For each={days()}>
      {group => (
        <>
          <ScheduleDayHeader day={group.day}/>
          <For each={group.streams}>
            {stream => props.children(stream)}
          </For>
        </>
      )}
    </For>
  )
}

// White label like the last-fetched pill, so it stays readable on every theme background.
const ScheduleDayHeader: Component<{ day: DateTime }> = (props) => {
  const now = useNow()
  const label = () => props.day.toLocaleString({weekday: 'long', day: 'numeric', month: 'long'})

  return (
    <div class={'flex flex-row items-center gap-2 pt-1 first:pt-0'}>
      <h4 class={'shrink-0 rounded-full bg-white px-2 py-0.5 text-xxs font-bold text-black shadow-sm'}>
        {props.day.hasSame(now(), 'day') ? `Today · ${label()}` : label()}
      </h4>
      <div class={'h-px flex-1 rounded-full bg-white/70'}/>
    </div>
  )
}
