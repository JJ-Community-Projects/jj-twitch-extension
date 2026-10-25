import {type Component, For, Show} from "solid-js";
import {useScheduleState} from "../providers/ScheduleStateProvider.tsx";
import {ScheduleSlot} from "./ScheduleSlotDialog.tsx";
import {useCreatorFilter} from "../providers/CreatorFilterProvider.tsx";
import {useBackend} from "../providers/BackendProvider.tsx";
import {ScheduleLastFetchedPill} from "./ScheduleLastFetchedPill.tsx";
import {ScheduleDayGroups} from "./ScheduleDayGroups.tsx";


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
        <ScheduleDayGroups streams={filteredStreams()}>
          {stream => (
            <ScheduleSlot stream={stream} showCountdown={true} class={'flex-1'}/>
          )}
        </ScheduleDayGroups>
      </Show>
      <ScheduleLastFetched/>
    </div>
  );
}

const ScheduleLastFetched: Component = () => {
  const {yogsSchedule} = useBackend()

  return (
    <Show when={yogsSchedule.status === 'success'}>
      <ScheduleLastFetchedPill updatedAt={yogsSchedule.dataUpdatedAt}/>
    </Show>
  );
}
