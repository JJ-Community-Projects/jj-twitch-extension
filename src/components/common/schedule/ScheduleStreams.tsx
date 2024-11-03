import {type Component, For, Show} from "solid-js";
import {useScheduleState} from "../providers/ScheduleStateProvider.tsx";
import {StreamCard} from "./StreamCard.tsx";
import {useCreatorFilter} from "../providers/CreatorFilterProvider.tsx";


export const ScheduleStreams: Component = (props) => {
  const {day, streams} = useScheduleState()
  const dayStreams = () => {
    return day().streams
  }

  const {isEmpty, filteredStreams} = useCreatorFilter()


  return (
    <div class={'flex min-h-full flex-col gap-2 px-2'}>
      <Show when={isEmpty()}>
        <For each={dayStreams()}>
          {stream => (
            <StreamCard stream={stream} showCountdown={true} showTime={true}/>
          )}
        </For>
      </Show>
      <Show when={!isEmpty()}>
        <For each={filteredStreams()}>
          {stream => (
            <StreamCard stream={stream} showCountdown={true} showTime={true}/>
          )}
        </For>
      </Show>
    </div>
  );
}
