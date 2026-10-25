import {type Component, For, Show} from "solid-js";
import {useScheduleState} from "../providers/ScheduleStateProvider.tsx";
import {ScheduleSlot} from "./ScheduleSlotDialog.tsx";
import {useCreatorFilter} from "../providers/CreatorFilterProvider.tsx";
import {useBackend} from "../providers/BackendProvider.tsx";
import {DateTime} from "luxon";


export const ScheduleStreams: Component = () => {
  const {day} = useScheduleState()
  const dayStreams = () => {
    return day().streams
  }

  const {isEmpty, filteredStreams} = useCreatorFilter()

  return (
    <div class={'flex min-h-full flex-col gap-2 px-2'}>
      <Show when={isEmpty()}>
        <For each={dayStreams()}>
          {stream => (
            <ScheduleSlot stream={stream} showCountdown={true} class={'flex-1'}/>
          )}
        </For>
      </Show>
      <Show when={!isEmpty()}>
        <For each={filteredStreams()}>
          {stream => (
            <ScheduleSlot stream={stream} showCountdown={true} showDate={true} class={'flex-1'}/>
          )}
        </For>
      </Show>
      <ScheduleLastFetched/>
    </div>
  );
}

// Sits directly below the last slot; sticky, so it stays visible at the bottom when the list scrolls.
// Also names the viewer's time zone, since the slot items show local times without one.
const ScheduleLastFetched: Component = () => {
  const {yogsSchedule} = useBackend()

  const date = () => {
    if (yogsSchedule.status !== 'success') {
      return undefined
    }
    return DateTime.fromMillis(yogsSchedule.dataUpdatedAt)
  }

  return (
    <Show when={date()}>
      {
        date => (
          <div class={'sticky bottom-0 flex flex-row justify-between gap-2 rounded-2xl bg-white px-3 py-1 text-xxs font-semibold text-black shadow-sm'}>
            <p class={'min-w-0 truncate'}>Last fetched {date().toLocaleString(DateTime.DATETIME_SHORT)}</p>
            <p class={'shrink-0'}>All times in {DateTime.local().offsetNameShort}</p>
          </div>
        )
      }
    </Show>
  );
}
